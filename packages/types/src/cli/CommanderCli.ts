import { CliService } from "./CliService";

export interface CommanderCli {
  parseArgs(): CommanderCli;
  usesMsgs(str: string): CommanderCli;
  get args(): {
    [key: string]: any;
  };
  get CliService(): CliService;
}
