import { ICommand } from "../cli";
import { EcoRouter, EcoServer } from "./service";
import { Logger } from "../utils";
import { Config } from "./config";
import _ from "lodash";
import { EcoContainer } from "./EcoContainer";
import { EcoHelper } from "./EcoHelper";
import { Database } from "../database";

export * from "./config";
export * from "./EcoHelper";
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
  helper: EcoHelper;
  container: EcoContainer;
  get config(): Config;
  get database(): Database;
  get log(): Logger;
  get Version(): string;
}
