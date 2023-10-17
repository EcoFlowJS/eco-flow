import { ICommand } from "../cli";
import { Server } from "../service";
import { Logger } from "../utils";
import { Config } from "./config";
import _ from "lodash";

export * from "./config";
export * from "./helper";
export * from "./EcoContainer";
export * from "./EcoFactory";

export interface EcoOptions {
  cli?: ICommand;
  [key: string]: any;
}

export type loadedEcoFlow = Required<EcoFlow>;

export interface EcoFlow {
  isAuth: boolean;
  _: typeof _;
  server: Server;
  get config(): Config;
  get logger(): Logger;
  get Version(): string;
}

