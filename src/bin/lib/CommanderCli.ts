import { Command, CommandOptions } from "commander";
import baseCommands from "../commands/command";
import adminCommand from "../commands/admin";
import { EcoFlow } from "../../core";

/**
 * Command manager for the command manager service provider interface of the application component.
 * This class is responsible for managing the command manager service provider interface of the application component
 * and provides the command manager service provider interface to manage the application component using the command manager.
 */
export class CommanderCli {
  private command: Command = baseCommands;
  private opts: { [key: string]: any } = {};
  constructor() {
    this.initCommanders();
  }

  /**
   * Parse the command manager service provider interface.
   * @param command instance of the @class {Command} or list of @class {Command} thats options to be passed.
   * @returns instance of CommanderCli class.
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
   * Configure the basic commands settings for the command manager instance.
   * @returns instance of CommanderCli class.
   */
  private configureCommanders(): CommanderCli {
    this.command
      .version(EcoFlow.Version)
      .addHelpText("beforeAll", `Eco-Flow v${EcoFlow.Version}`)
      .usage(
        `[-?] [-h] [--settings settings.js] [--userDir DIR]
               [--port PORT] [--title TITLE] [--safe] [flows.json]

        ecoflow admin <command> [args] [-?] [--userDir DIR] [--json]`
      )
      .configureHelp({
        visibleOptions: (cmd) => {
          return [...baseCommands.options];
        },
      })
      .helpOption("-?, --help", "Show this help message")
      .passThroughOptions(true);
    return this;
  }

  /**
   * Innitialize the command manager service's subcommands and commands.
   * @returns instance of CommanderCli class.
   */
  private initSubcommands(): CommanderCli {
    this.command.addCommand(adminCommand);
    return this;
  }

  /**
   * Innitialize the command manager service.
   * @returns instance of CommanderCli class.
   */
  private initCommanders(): CommanderCli {
    this.addParser([baseCommands, adminCommand])
      .configureCommanders()
      .initSubcommands();
    return this;
  }

  /**
   * Parse the option arguments commands from the Command line.
   * @returns Innitialize the command manager service.
   */
  parseArgs(): CommanderCli {
    this.command.parse();
    return this;
  }

  /**
   * Return the passed option arguments to objects.
   * @returns object of option arguments passed.
   */
  get commands(): { [key: string]: any } {
    return this.opts._ecoflow;
  }
}
