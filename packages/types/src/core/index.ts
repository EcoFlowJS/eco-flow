import { ICommand } from "../cli";
import { configSettings } from "../config";

export interface EcoFlowArgs {
  cli?: ICommand;
  [key: string]: any;
}

export type ecoFlow = {
  config?: configSettings;
};
