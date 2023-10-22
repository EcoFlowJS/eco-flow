import Koa from "koa";
import httpServer, { Server as HttpServer } from "http";
import httpsServer, { Server as HttpsServer } from "https";
import _ from "lodash";
import koaCors from "@koa/cors";
import { EcoServer as IEcoServer, configOptions } from "@eco-flow/types";

export class EcoServer extends Koa implements IEcoServer {
  private _https!: typeof configOptions.https;
  private _isHttps: boolean = false;
  private _host!: typeof configOptions.Host;
  private _port!: typeof configOptions.Port;
  private _httpCors!: koaCors.Options;
  private _server!: HttpServer | HttpsServer;

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
      if (_.has(https, "keyt") && _.has(https, "cert")) {
        this._isHttps = true;
        this._https = https;
      }
    }

    if (!_.isEmpty(Host)) this._host = Host;
    if (_.isNumber(Port)) this._port = Port;
    if (!_.isEmpty(httpCors)) this._httpCors = httpCors;
  }

  /**
   * Start the server process for the application to process HTTP/HTTPS requests.
   * @returns { httpServer.Server<typeof httpServer.IncomingMessage,typeof httpServer.ServerResponse>| httpsServer.Server<typeof httpServer.IncomingMessage,typeof httpServer.ServerResponse> } Server instance.
   */
  startServer():
    | httpServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      >
    | httpsServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      > {
    this._server = httpServer.createServer(this.callback());
    if (this._isHttps)
      this._server = httpsServer.createServer(this._https!, this.callback());
    this.use(koaCors(this._httpCors));

    return this._server.listen(
      parseInt(this._port!.toString()),
      this._host,
      () => {
        ecoFlow.log.info(
          `Server listening on ${this._isHttps ? "https" : "http"}://${
            this._host
          }:${this._port}`
        );
        ecoFlow.log.info("====================================");
      }
    );
  }

  /**
   * Close the running HTTP/HTTPS server process and disconnect all connections.
   * @returns { void }
   */
  closeServer(): void {
    this._server.close((err) => {
      if (err) throw err;
      ecoFlow.log.info(
        `Stopping server on ${this._isHttps ? "https" : "http"}://${
          this._host
        }:${this._port}`
      );
      ecoFlow.log.info("====================================");
    });
  }

  /**
   * Restarts the HTTP/HTTPS server process and all connections.
   * @returns {Promise} Server instance.
   */
  async restartServer(): Promise<
    | httpServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      >
    | httpsServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      >
  > {
    ecoFlow.log.info("Restarting server........");
    return new Promise((resolve, reject) => {
      this._server.close((err) => {
        if (err) reject(err);
        ecoFlow.log.info(
          `Stopping server on ${this._isHttps ? "https" : "http"}://${
            this._host
          }:${this._port}`
        );
        ecoFlow.log.info("====================================");
        this.processConfig();
        resolve(this.startServer());
      });
    });
  }
}
