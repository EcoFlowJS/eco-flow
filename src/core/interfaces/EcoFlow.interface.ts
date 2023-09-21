import { ICommand } from "../../bin/commands/command";

export interface EcoFlowArgs {
  cli?: ICommand;
  [key: string]: any;
}
