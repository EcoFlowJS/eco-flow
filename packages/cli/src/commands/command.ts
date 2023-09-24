import { Option, Command } from "commander";
import { configSettings } from "@eco-flow/config";
const baseCommand = new Command("ecoflow");
export default baseCommand;

baseCommand
  .configureHelp({ showGlobalOptions: true })
  .addOption(new Option("-h, --host <address>", "Set a specific host binding"))
  .addOption(new Option("-p, --port <number>", "Port to listen on").env("PORT"))
  .addOption(new Option("--auth", "Set authentication to the flow"))
  .addOption(
    new Option(
      "-c, --configDir <string>",
      "use specified configuration file location"
    ).env("configDir")
  )
  .addOption(
    new Option(
      "-cn, --configName <string>",
      "use specified configuration file name. \n\t\t\t\t\b\b[ NOTE: Extention will be automatically added to the config file name. ]"
    )
  )
  .addOption(
    new Option("-u, --user <string>", "use specified user directory").env(
      "userDir"
    )
  )
  .addOption(new Option("-v, --verbose", "Enable verbose output"))
  .helpOption("-?, --help", "Show this help message");

export interface ICommand extends configSettings {
  auth?: boolean;
  configDir?: string;
  configName?: string;
}
