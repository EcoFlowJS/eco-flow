import { Command, CommandOptions, Option } from "commander";
import baseCommand from "../commands/command.js";
import adminCommand from "../commands/admin.js";
import EcoFlow from "@ecoflow/ecoflow";
import {
  CliService as ICliService,
  CommanderCli as ICommanderCli,
} from "@ecoflow/types";
import { CliService } from "./CliService.js";

/**
 * CommanderCli class that implements CommanderCli interface.
 * This class is responsible for handling command line interface operations.
 */
export class CommanderCli implements ICommanderCli {
  private command: Command = baseCommand;
  private commands!: Command[];
  private opts: { [key: string]: any } = {};

  /**
   * Constructor function for initializing the command and commands array.
   * If the baseCommand is defined, sets the command to baseCommand,
   * sets the commands array to contain adminCommand, and initializes the commanders.
   * @returns None
   */
  constructor() {
    if (typeof baseCommand !== "undefined") {
      this.command = baseCommand;
      this.commands = [adminCommand];
      this.initCommanders();
    }
  }

  /**
   * Adds a parser for the given command or array of commands to the CommanderCli instance.
   * @param {Command | Command[]} command - The command or array of commands to add a parser for.
   * @returns {CommanderCli} The updated CommanderCli instance with the parser added.
   */
  private addParser(command: Command | Command[]): CommanderCli {
    if (Array.isArray(command)) command.forEach((cmd) => this.addParser(cmd));
    if (command instanceof Command)
      command.action((options: CommandOptions, cmd: Command) => {
        let opts: { [key: string]: any } = {};
        let parent = cmd.parent;
        opts["_" + cmd.name()] = { ...options };
        while (parent != null) {
          let tmp: { [key: string]: any } = { ...opts };
          opts = {};
          opts["_" + parent.name()] = { ...tmp };
          parent = parent.parent;
        }
        this.opts = { ...this.opts, ...opts };
      });

    return this;
  }

  /**
   * Configures the Commander CLI by setting up the version, help text, visible options,
   * help option, and pass through options.
   * @returns {CommanderCli} - The configured Commander CLI instance.
   */
  private configureCommanders(): CommanderCli {
    this.command
      .version(EcoFlow.Version)
      .addHelpText("beforeAll", `Eco-Flow v${EcoFlow.Version}`)
      .configureHelp({
        visibleOptions: (_cmd: any) => {
          return [
            ...this.command.options,
            new Option("-?, --help", "Show this help message"),
          ];
        },
      })
      .helpOption("-?, --help", "Show this help message")
      .passThroughOptions(true);
    return this;
  }

  /**
   * Initializes subcommands by adding each command to the main command.
   * @returns {CommanderCli} - The CommanderCli instance with subcommands added.
   */
  private initSubcommands(): CommanderCli {
    this.commands.forEach((command: Command) => {
      this.command.addCommand(command);
    });
    return this;
  }

  /**
   * Initializes the Commander CLI by adding parsers, configuring commanders, and initializing subcommands.
   * @returns {CommanderCli} - The Commander CLI instance with initialized commanders.
   */
  private initCommanders(): CommanderCli {
    this.addParser([this.command, ...this.commands])
      .configureCommanders()
      .initSubcommands();
    return this;
  }

  /**
   * Parse the command line arguments using CommanderCli.
   * @returns {CommanderCli} - The CommanderCli instance after parsing the arguments.
   */
  parseArgs(): CommanderCli {
    this.command.parse();
    return this;
  }

  /**
   * Sets the usage message for the Commander CLI command.
   * @param {string} str - The usage message to be displayed.
   * @returns {CommanderCli} - The CommanderCli instance for method chaining.
   */
  usesMsgs(str: string): CommanderCli {
    this.command.usage(str);
    return this;
  }

  /**
   * Getter method to retrieve the arguments stored in the _ecoflow property of the opts object.
   * @returns An object containing the arguments stored in the _ecoflow property.
   */
  get args(): { [key: string]: any } {
    return this.opts._ecoflow;
  }

  /**
   * Returns an instance of the CliService class that implements the CliService interface.
   * @returns An instance of the CliService class.
   */
  get CliService(): ICliService {
    return new CliService();
  }
}
