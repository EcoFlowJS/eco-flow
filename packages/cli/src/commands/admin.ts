import { Command } from "commander";
const adminCommand = new Command("admin");
export default adminCommand;

adminCommand
  .description("This is a subcommand with options")
  .passThroughOptions(true)
  .option("-s, --directory <directory>", "Specify a directory")
  .helpOption("-?, --help", "Show this help message");
