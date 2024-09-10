import { CliService } from "./CliService.js";

/**
 * Interface for a Commander CLI object that provides methods for parsing arguments,
 * setting usage messages, accessing arguments, and getting the CLI service.
 * @interface CommanderCli
 * @method parseArgs - Parses the command line arguments.
 * @method usesMsgs - Sets the usage message for the CLI.
 * @property args - An object containing key-value pairs of arguments.
 * @property CliService - An instance of the CliService class.
 */
export interface CommanderCli {
  /**
   * Parse the command line arguments using CommanderCli.
   * @returns {CommanderCli} - The CommanderCli instance after parsing the arguments.
   */
  parseArgs(): CommanderCli;

  /**
   * Sets the usage message for the Commander CLI command.
   * @param {string} str - The usage message to be displayed.
   * @returns {CommanderCli} - The CommanderCli instance for method chaining.
   */
  usesMsgs(str: string): CommanderCli;

  /**
   * Getter method to retrieve the arguments stored in the _ecoflow property of the opts object.
   * @returns An object containing the arguments stored in the _ecoflow property.
   */
  get args(): {
    [key: string]: any;
  };

  /**
   * Returns an instance of the CliService class that implements the CliService interface.
   * @returns An instance of the CliService class.
   */
  get CliService(): CliService;
}
