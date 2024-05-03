import { ICommand } from "../cli";
import { EcoRouter, EcoServer } from "./service";
import { Logger } from "../utils";
import { Config } from "./config";
import type _ from "lodash";
import { EcoContainer } from "./EcoContainer";
import { Database } from "../database";
import { EcoModule } from "../module";
import { Service } from "../services";
import type { Server } from "socket.io";
import { EcoFlowEditor } from "../flows";

export * from "./config";
export * from "./EcoContainer";
export * from "./EcoFactory";
export * from "./service";
export * from "./api";

export interface ClassType<InstanceType extends {} = any> extends Function {
  new (...args: any[]): InstanceType;
  prototype: InstanceType;
}

export interface EcoOptions {
  cli?: ICommand;
  [key: string]: any;
}

export type loadedEcoFlow = Required<EcoFlow>;

export interface EcoFlow {
  isAuth: boolean;
  _: typeof _;
  server: EcoServer;
  socket: Server;
  router: EcoRouter;
  container: EcoContainer;
  get config(): Config;
  get database(): Database;
  get ecoModule(): EcoModule;
  get flowEditor(): EcoFlowEditor;
  get service(): Service;
  get log(): Logger;
  get Version(): string;
}
