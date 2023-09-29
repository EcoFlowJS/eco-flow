import { Command } from "commander";
const adminCommand = new Command("admin");
export default adminCommand;

adminCommand
  .description("Admin command for configuring application.")
  .passThroughOptions(true)
  .option("-s, --directory <directory>", "Specify a directory")
  .helpOption("-?, --help", "Show this help message");
