import { configOptions } from "../../ecoflow/index.js";

export interface Logger {
  /**
   * Enable verbose logging for this transport instance and for all other transport instances
   * that are running in this transport instance (e.g. web app instance instances).
   * @memberof Logger
   * @param verbose {boolean} Whether to enable verbose logging for this transport instance and all other transport instances.
   * @returns instance of Logger class.
   */
  setVerbose(verbose?: boolean): Logger;

  /**
   * Use this method to update the configuration of the logging configuration to the new configuration settings for the current transport instances.
   * @memberof Logger
   * @param Configuration object containing configuration settings for logging configuration settings for this instances.
   * @returns instance of Logger class.
   */
  updateConfig({ logging }: configOptions): Logger;

  /**
   * Log to the given transport in the configuration settings for logging configuration settings for this instances.
   * @memberof Logger
   * @param message Object containing the level message to be logged by the logger instance.
   * message object contains the message to be logged by the logger instance.
   * if message does not contain level then it will be logged with the default level INFO
   * otherwise it will be logged with the given level.
   * @returns instance of Logger class.
   */
  log(message: { level?: number; message: any }): Logger;

  /**
   * Logs a message to the logger at ERROR level.
   * @memberof Logger
   * @param message const the message to be logged by the logger instance.
   * @returns instance of Logger class.
   */
  error(message: any): Logger;

  /**
   * Logs a message to the logger at WARN level.
   * @memberof Logger
   * @param message const the message to be logged by the logger instance.
   * @returns instance of Logger class.
   */
  warn(message: any): Logger;

  /**
   * Logs a message to the logger at INFO level.
   * @memberof Logger
   * @param message const the message to be logged by the logger instance.
   * @returns instance of Logger class.
   */
  info(message: any): Logger;

  /**
   * Logs a message to the logger at VERBOSE level.
   * @memberof Logger
   * @param message const the message to be logged by the logger instance.
   * @returns instance of Logger class.
   */
  verbose(message: any): Logger;

  /**
   * Logs a message to the logger at DEBUG level.
   * @memberof Logger
   * @param message const the message to be logged by the logger instance.
   * @returns instance of Logger class.
   */
  debug(message: any): Logger;
}
