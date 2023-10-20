import { ICommand } from "../cli";
import { EcoRouter, EcoServer } from "./service";
import { Logger } from "../utils";
import { Config } from "./config";
import _ from "lodash";

export * from "./config";
export * from "./helper";
export * from "./EcoContainer";
export * from "./EcoFactory";
export * from "./service";

export interface EcoOptions {
  cli?: ICommand;
  [key: string]: any;
}

export type loadedEcoFlow = Required<EcoFlow>;

export interface EcoFlow {
  isAuth: boolean;
  _: typeof _;
  server: EcoServer;
  router: EcoRouter;
  get config(): Config;
  get log(): Logger;
  get Version(): string;
}

