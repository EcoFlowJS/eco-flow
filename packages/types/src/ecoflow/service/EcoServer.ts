import Koa from "koa";
import httpServer from "http";
import httpsServer from "https";
import passport from "koa-passport";
import { StrategyOptions } from "passport-jwt";
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
  get baseUrl(): string;
  get isSecure(): boolean;
  initializePassport(options: StrategyOptions): Promise<void>;
}
