import Koa from "koa";
import httpServer, { Server as HttpServer } from "http";
import httpsServer, { Server as HttpsServer } from "https";
import _ from "lodash";
import koaCors from "@koa/cors";
import { Server as IServer, configOptions } from "@eco-flow/types";
export class Server extends Koa implements IServer {
  private _https!: typeof configOptions.https;
  private _isHttps: boolean = false;
  private _host!: typeof configOptions.Host;
  private _port!: typeof configOptions.Port;
  private _httpCors!: koaCors.Options;
  private _server!: HttpServer | HttpsServer;

  constructor(options?: {
    env?: string | undefined;
    keys?: string[] | undefined;
    proxy?: boolean | undefined;
    subdomainOffset?: number | undefined;
    proxyIpHeader?: string | undefined;
    maxIpsCount?: number | undefined;
  }) {
    super(options);
    this.processConfig();
  }

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
        ecoFlow.logger.info(
          `Server listening on ${this._isHttps ? "https" : "http"}://${
            this._host
          }:${this._port}`
        );
        ecoFlow.logger.info("====================================");
      }
    );
  }

  closeServer(): void {
    this._server.close((err) => {
      if (err) throw err;
      ecoFlow.logger.info(
        `Stopping server on ${this._isHttps ? "https" : "http"}://${
          this._host
        }:${this._port}`
      );
      ecoFlow.logger.info("====================================");
    });
  }

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
    ecoFlow.logger.info("Restarting server........");
    return new Promise((resolve, reject) => {
      this._server.close((err) => {
        if (err) reject(err);
        ecoFlow.logger.info(
          `Stopping server on ${this._isHttps ? "https" : "http"}://${
            this._host
          }:${this._port}`
        );
        ecoFlow.logger.info("====================================");
        this.processConfig();
        resolve(this.startServer());
      });
    });
  }
}
