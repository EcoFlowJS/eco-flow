import { Option, Command } from "commander";
const program = new Command("ecoflow");
export default program;

program
  .configureHelp({ showGlobalOptions: true })
  .addOption(new Option("-h, --host <address>", "Set a specific host binding"))
  .addOption(new Option("-p, --port <number>", "Port to listen on").env("PORT"))
  .addOption(
    new Option(
      "-c, --config <string>",
      "use specified configuration file location"
    ).env("configDir")
  )
  .addOption(
    new Option("-u, --user <string>", "use specified user directory").env(
      "userDir"
    )
  )
  .addOption(new Option("-v, --verbose", "Enable verbose output"))
  .helpOption("-?, --help", "Show this help message");
