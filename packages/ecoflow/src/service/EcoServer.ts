import Koa from "koa";
import koaBody from "koa-body";
import passport from "koa-passport";
import httpServer, { Server as HttpServer } from "http";
import httpsServer, { Server as HttpsServer } from "https";
import { Server, Socket } from "socket.io";
import koaCors from "@koa/cors";
import { EcoServer as IEcoServer, configOptions } from "@ecoflow/types";
import { Passport } from "./Passport.js";
import { StrategyOptionsWithoutRequest } from "passport-jwt";
import EcoFlow from "../lib/EcoFlow.js";
import socketEvents from "../api/socketEvents/socketEvents.events.js";

/**
 * Represents an EcoServer that extends Koa and implements EcoServer interface.
 * @constructor
 * @param {object} options - The options for the EcoServer.
 * @param {string} [options.env] - The environment setting.
 * @param {string[]} [options.keys] - The keys for the server.
 * @param {boolean} [options.proxy] - Indicates if proxy is enabled.
 * @param {number} [options.subdomainOffset] - The subdomain offset value.
 * @param {string} [options.proxyIpHeader] - The proxy IP header value.
 * @param {number} [options.maxIpsCount] - The maximum number of IPs allowed.
 */
export class EcoServer extends Koa implements IEcoServer {
  private _https!: typeof configOptions.https;
  private _isHttps: boolean = false;
  private _host!: typeof configOptions.Host;
  private _port!: typeof configOptions.Port;
  private _httpCors!: koaCors.Options;
  private _server!: HttpServer | HttpsServer;
  private _serverStatus: "Online" | "Offline" = "Offline";

  /**
   * A variable declaration that assigns the passport module to the passport variable.
   * @param {typeof passport} passport - The passport module
   * @returns The passport module assigned to the passport variable.
   */
  passport: typeof passport = passport;

  /**
   * The Server object representing the system socket.
   */
  systemSocket!: Server;

  /**
   * The WebSocket server instance.
   */
  socket!: Server;

  /**
   * EcoFlow Server Library interface implementation for HTTP/HTTPS connections and APIs requests.
   * @param {object} [options] Application options
   * @param {string} [options.env='development'] Environment
   * @param {string[]} [options.keys] Signed cookie keys
   * @param {boolean} [options.proxy] Trust proxy headers
   * @param {number} [options.subdomainOffset] Subdomain offset
   * @param {string} [options.proxyIpHeader] Proxy IP header, defaults to X-Forwarded-For
   * @param {number} [options.maxIpsCount] Max IPs read from proxy IP header, default to 0 (means infinity)
   * @memberof EcoServer
   * @returns {EcoServer} instance of EcoServer
   */
  constructor(
    options: {
      env?: string | undefined;
      keys?: string[] | undefined;
      proxy?: boolean | undefined;
      subdomainOffset?: number | undefined;
      proxyIpHeader?: string | undefined;
      maxIpsCount?: number | undefined;
    } = {}
  ) {
    if (ecoFlow._.isEmpty(options.env))
      if (ecoFlow._.has(process.env, "ECO_ENV") && process.env.ECO_ENV)
        options.env = "production";

    super(options);
    this.processConfig();
  }

  /**
   * Processes the configuration settings for the server, setting up HTTPS if enabled,
   * configuring the host, port, CORS settings, and creating HTTP and HTTPS servers.
   * Also sets up socket connections for system and user sockets.
   * @returns None
   */
  private processConfig() {
    const { _, config } = ecoFlow;
    const { https, Host, Port, httpCors } = config._config;
    if (!_.isEmpty(https) && https.enabled) {
      if (
        _.has(https, "key") &&
        _.has(https, "cert") &&
        !_.isEmpty(https.key) &&
        !_.isEmpty(https.cert)
      ) {
        this._isHttps = true;
        this._https = https;
      }
    }

    if (!_.isEmpty(Host)) this._host = Host;
    if (_.isNumber(Port)) this._port = Port;
    if (!_.isEmpty(httpCors) && httpCors.enabled) this._httpCors = httpCors;

    this._server = httpServer.createServer(this.callback());
    if (this._isHttps)
      this._server = httpsServer.createServer(this._https!, this.callback());
    this.use(koaCors(this._httpCors));
    this.use(
      koaBody.koaBody({
        multipart: true,
      })
    );

    const socketCors = {
      origin: this._httpCors.origin?.toString(),
      methods: this._httpCors.allowMethods,
      allowedHeaders: this._httpCors.allowHeaders,
      exposedHeaders: this._httpCors.exposeHeaders,
      credentials: this._httpCors.credentials ? true : false,
      maxAge: Number(this._httpCors.maxAge),
    };

    this.systemSocket = new Server(this._server, {
      path: "/socket.ecoflow",
      cors: socketCors,
    });

    this.socket = new Server(this._server, {
      cors: socketCors,
    });
    this.socket.on("join", (room) => {
      this.socket.socketsJoin(room);
    });

    this.systemSocket.on("connection", (socket: Socket) => {
      socketEvents({
        io: this.systemSocket,
        socket: socket,
      });
      console.log("WebSocket connected to socket.ecoflow");
    });
    this.socket.on("connection", () =>
      console.log("WebSocket connected to UserSocket")
    );
  }

  /**
   * Starts the server and listens on the specified port and host.
   * @returns A Promise that resolves to an HTTP or HTTPS server instance.
   */
  async startServer(): Promise<
    | httpServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      >
    | httpsServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      >
  > {
    const { log } = ecoFlow;
    const server = await this._server.listen(
      parseInt(this._port!.toString()),
      this._host
    );
    log.info(
      `Server listening on ${this._isHttps ? "https" : "http"}://${
        this._host === "0.0.0.0" ? "localhost" : this._host
      }:${this._port}`
    );
    log.info("====================================");
    this._serverStatus = "Online";
    return server;
  }

  /**
   * Asynchronously closes the server.
   * @param {boolean} [exit=false] - Whether to exit the process after closing the server.
   * @returns {Promise<void>} A Promise that resolves once the server is closed.
   */
  async closeServer(exit: boolean = false): Promise<void> {
    const { log } = ecoFlow;
    log.info(
      `Stopping server on ${this._isHttps ? "https" : "http"}://${
        this._host === "0.0.0.0" ? "localhost" : this._host
      }:${this._port}`
    );
    log.info("====================================");
    return new Promise<void>((resolve, reject) => {
      if (exit) {
        resolve();
        process.exit();
      }

      this._server.closeAllConnections();
      this.systemSocket.sockets.disconnectSockets(true);
      this.socket.sockets.disconnectSockets(true);
      this._server.close((err) => {
        if (err) reject(err);
        this._serverStatus = "Offline";
        log.info(
          `Server Stopped on ${this._isHttps ? "https" : "http"}://${
            this._host === "0.0.0.0" ? "localhost" : this._host
          }:${this._port}`
        );
        log.info("====================================");
        resolve();
        setTimeout(
          () =>
            process.send
              ? process.send(EcoFlow.processCommands.STOP)
              : process.exit(0),
          1000
        );
      });
    });
  }

  /**
   * Asynchronously restarts the server process.
   * @returns A Promise that resolves when the server has been successfully restarted.
   */
  async restartServer(): Promise<void> {
    const { log } = ecoFlow;
    log.info("Restarting server process...");
    log.info("====================================");
    return new Promise<void>((resolve, reject) => {
      this.closeServer()
        .then(() => {
          resolve();
          setTimeout(
            () =>
              process.send
                ? process.send(EcoFlow.processCommands.RESTART)
                : process.exit(1),
            1000
          );
        })
        .catch((err) => reject(err));
    });
  }

  /**
   * Initializes Passport with the provided options.
   * @param {StrategyOptionsWithoutRequest} [options] - The options to configure Passport.
   * @returns {Promise<void>} A promise that resolves once Passport has been initialized.
   */
  async initializePassport(
    options?: StrategyOptionsWithoutRequest
  ): Promise<void> {
    await new Passport(this, options).init();
  }

  /**
   * Returns the base URL constructed from the host, port, and protocol (http or https).
   * @returns {string} The base URL formed by combining the protocol, host, and port.
   */
  get baseUrl(): string {
    return `${this._isHttps ? "https" : "http"}://${
      this._host === "0.0.0.0" ? "localhost" : this._host
    }:${this._port}`;
  }

  /**
   * Getter method to check if the connection is secure (HTTPS).
   * @returns {boolean} - true if the connection is secure (HTTPS), false otherwise
   */
  get isSecure(): boolean {
    return this._isHttps;
  }

  /**
   * Get the current server state, which can be either "Online" or "Offline".
   * @returns The current server state.
   */
  get serverState(): "Online" | "Offline" {
    return this._serverStatus;
  }
}
