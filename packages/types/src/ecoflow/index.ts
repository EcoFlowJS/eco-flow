import { ICommand } from "../cli";
import { configSettings } from "./config";

export * from "./config";
export * from "./EcoContainer";

export interface EcoFlowArgs {
  cli?: ICommand;
  [key: string]: any;
}

export interface ecoFlow {
  config?: configSettings;
  [key: string]: unknown;
};
