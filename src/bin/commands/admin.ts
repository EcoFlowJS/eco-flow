import { Command } from "commander";
const program = new Command("admin");
export default program;

program
  .description("This is a subcommand with options")
  .passThroughOptions(true)
  .option("-s, --directory <directory>", "Specify a directory")
  .helpOption("-?, --help", "Show this help message");
