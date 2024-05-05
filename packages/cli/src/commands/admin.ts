import { Command } from "commander";
const adminCommand = new Command("admin");
export default adminCommand;

/**
 * Configures the admin command for the application.
 * @returns None
 */
adminCommand
  .description("Admin command for configuring application.")
  .passThroughOptions(true)
  .option("-s, --directory <directory>", "Specify a directory")
  .helpOption("-?, --help", "Show this help message");
