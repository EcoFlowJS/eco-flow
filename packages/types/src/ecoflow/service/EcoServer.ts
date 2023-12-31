import Koa from "koa";
import httpServer from "http";
import httpsServer from "https";
import passport from "koa-passport";
import { IStrategyOptions, IStrategyOptionsWithRequest } from "passport-local";
export interface EcoServer extends Koa {
  passport: typeof passport;
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
  initializePassport(options: IStrategyOptions): Promise<void>;
}
