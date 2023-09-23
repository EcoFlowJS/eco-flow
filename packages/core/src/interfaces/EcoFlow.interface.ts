import { ICommand } from "@eco-flow/cli";

export interface EcoFlowArgs {
  cli?: ICommand;
  [key: string]: any;
}
