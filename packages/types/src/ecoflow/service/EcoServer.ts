import Koa from "koa";
import httpServer from "http";
import httpsServer from "https";
export interface EcoServer extends Koa {
  startServer():
    | httpServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      >
    | httpsServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      >;
  closeServer(): void;
  restartServer(): Promise<
    | httpServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      >
    | httpsServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      >
  >;
}
