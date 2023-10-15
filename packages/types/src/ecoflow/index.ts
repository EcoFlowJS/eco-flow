import { ICommand } from "../cli";
import { Logger } from "../utils";
import { Config } from "./config";

export * from "./config";
export * from "./EcoContainer";

export interface EcoOptions {
  cli?: ICommand;
  [key: string]: any;
}

export type loadedEcoFlow = Required<EcoFlow>;

export interface EcoFlow {
  isAuth: boolean;
  config: Config;
  logger: Logger;
}

