import Koa from "koa";
import httpServer from "http";
import httpsServer from "https";
import passport from "koa-passport";
import type { StrategyOptionsWithoutRequest } from "passport-jwt";
import type { Server, Socket } from "socket.io";

export interface EcoServer extends Koa {
  /**
   * A reference to the Passport module.
   * @type {typeof passport}
   */
  passport: typeof passport;

  /**
   * Represents a server socket for system communication.
   * @type {Server}
   */
  systemSocket: Server;

  /**
   * Represents a socket server instance.
   * @type {Server}
   */
  socket: Server;

  /**
   * Starts the server and listens on the specified port and host.
   * @returns A Promise that resolves to an HTTP or HTTPS server instance.
   */
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

  /**
   * Asynchronously closes the server.
   * @param {boolean} [exit=false] - Whether to exit the process after closing the server.
   * @returns {Promise<void>} A Promise that resolves once the server is closed.
   */
  closeServer(exit?: boolean): Promise<void>;

  /**
   * Asynchronously restarts the server process.
   * @returns A Promise that resolves when the server has been successfully restarted.
   */
  restartServer(): Promise<void>;

  /**
   * Initializes Passport with the provided options.
   * @param {StrategyOptionsWithoutRequest} [options] - The options to configure Passport.
   * @returns {Promise<void>} A promise that resolves once Passport has been initialized.
   */
  initializePassport(options?: StrategyOptionsWithoutRequest): Promise<void>;

  /**
   * Returns the base URL constructed from the host, port, and protocol (http or https).
   * @returns {string} The base URL formed by combining the protocol, host, and port.
   */
  get baseUrl(): string;

  /**
   * Getter method to check if the connection is secure (HTTPS).
   * @returns {boolean} - true if the connection is secure (HTTPS), false otherwise
   */
  get isSecure(): boolean;

  /**
   * Get the current server state, which can be either "Online" or "Offline".
   * @returns The current server state.
   */
  get serverState(): "Online" | "Offline";
}

/**
 * Interface representing a Socket Server with properties `io` of type Server and `socket` of type Socket.
 */
export interface SocketServer {
  io: Server;
  socket: Socket;
}
