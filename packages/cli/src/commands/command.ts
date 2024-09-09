import { Option, Command } from "commander";
const baseCommand = new Command("ecoflow");
export default baseCommand;

/**
 * Configures the base command with various options for the command line interface.
 * Options include setting host binding, port number, authentication, configuration directory,
 * configuration file name, user directory, verbose output, and help message.
 * @returns None
 */
baseCommand
  .configureHelp({ showGlobalOptions: true })
  .addOption(new Option("-h, --host <address>", "Set a specific host binding"))
  .addOption(new Option("-p, --port <number>", "Port to listen on").env("PORT"))
  .addOption(new Option("--auth", "Set authentication to the flow"))
  .addOption(new Option("-D, --dev", "Run in development mode."))
  .addOption(
    new Option("-c, --config <string>", "use specified configuration file").env(
      "config"
    )
  )
  .addOption(
    new Option("-l, --local", "Set local directory as the working directory.")
  )
  .addOption(new Option("-v, --verbose", "Enable verbose output"))
  .helpOption("-?, --help", "Show this help message");
