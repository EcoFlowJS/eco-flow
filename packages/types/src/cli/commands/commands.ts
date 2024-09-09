import { loggerOptions } from "../../utils";

/**
 * Interface representing a command with optional properties.
 * @interface ICommand
 * @property {string} [Host] - The host of the command.
 * @property {number} [Port] - The port of the command.
 * @property {boolean} [auth] - Indicates if authentication is required for the command.
 * @property {string} [configDir] - The directory for configuration.
 * @property {string} [configName] - The name of the configuration.
 * @property {string} [userDir] - The directory for the user.
 * @property {loggerOptions} [logging] - Options for logging.
 * @property {boolean} [dev] - Indicates if the startup is in development mode.
 */
export interface ICommand {
  Host?: string;
  Port?: number;
  auth?: boolean;
  config?: string;
  logging?: loggerOptions;
  local?: boolean;
  dir?: string;
  dev?: boolean;
}
