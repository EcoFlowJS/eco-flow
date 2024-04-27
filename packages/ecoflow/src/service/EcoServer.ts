import Koa from "koa";
import koaBody from "koa-body";
import passport from "koa-passport";
import httpServer, { Server as HttpServer } from "http";
import httpsServer, { Server as HttpsServer } from "https";
import { Server, Socket } from "socket.io";
import _ from "lodash";
import koaCors from "@koa/cors";
import { EcoServer as IEcoServer, configOptions } from "@ecoflow/types";
import { Passport } from "./Passport";
import {
  StrategyOptions,
  StrategyOptionsWithRequest,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";
import EcoFlow from "../lib/EcoFlow";
import socketEvents from "../api/socketEvents/socketEvents.events";

export class EcoServer extends Koa implements IEcoServer {
  private _https!: typeof configOptions.https;
  private _isHttps: boolean = false;
  private _host!: typeof configOptions.Host;
  private _port!: typeof configOptions.Port;
  private _httpCors!: koaCors.Options;
  private _server!: HttpServer | HttpsServer;
  private _serverStatus: "Online" | "Offline" = "Offline";
  passport: typeof passport = passport;
  systemSocket!: Server;
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
   * Process config from EcoFlow environment. This method is called automatically before the server is started and restart of the server process.
   * @memberof EcoServer
   * @returns {void}
   */
  private processConfig() {
    const { https, Host, Port, httpCors } = ecoFlow.config._config;
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
      koaBody({
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
   * Start the server process for the application to process HTTP/HTTPS requests.
   * @returns { httpServer.Server<typeof httpServer.IncomingMessage,typeof httpServer.ServerResponse>| httpsServer.Server<typeof httpServer.IncomingMessage,typeof httpServer.ServerResponse> } Server instance.
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
   * Close the running HTTP/HTTPS server process and disconnect all connections.
   * @returns { void }
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
      this._server.closeAllConnections();
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
   * Restarts the HTTP/HTTPS server process and all connections.
   * @returns {Promise} Server instance.
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

  async initializePassport(
    options?: StrategyOptionsWithoutRequest
  ): Promise<void> {
    await new Passport(this, options).init();
  }

  get baseUrl(): string {
    return `${this._isHttps ? "https" : "http"}://${
      this._host === "0.0.0.0" ? "localhost" : this._host
    }:${this._port}`;
  }

  get isSecure(): boolean {
    return this._isHttps;
  }

  get serverState(): "Online" | "Offline" {
    return this._serverStatus;
  }
}
