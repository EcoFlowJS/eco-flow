import Koa from "koa";
import httpServer from "http";
import httpsServer from "https";
import passport from "koa-passport";
import type {
  StrategyOptionsWithoutRequest,
  StrategyOptionsWithRequest,
} from "passport-jwt";
import type { Server, Socket } from "socket.io";

export interface EcoServer extends Koa {
  startServer(): Promise<
    | httpServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      >
    | httpsServer.Server<
        typeof httpServer.IncomingMessage,
        typeof httpServer.ServerResponse
      >
  >;
  closeServer(exit?: boolean): Promise<void>;
  restartServer(): Promise<void>;
  initializePassport(options?: StrategyOptionsWithoutRequest): Promise<void>;
  get baseUrl(): string;
  get isSecure(): boolean;
  get serverState(): "Online" | "Offline";
  passport: typeof passport;
  systemSocket: Server;
  socket: Server;
}

export interface SocketServer {
  io: Server;
  socket: Socket;
}
