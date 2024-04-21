import { Context, Middleware } from "koa";
import { FlowsNodeDataTypes, NodesStack } from "../flows";
import { API_METHODS, Node, Nodes } from "../module";
import { Routes } from "./common";

export interface EcoAPIRouterBuilder {
  initializeBuilder(): Promise<EcoAPIRouterBuilder>;

  get routes(): Routes[];
}

export interface RouterRequestControllerBuilderOptions {
  apiMethod?: API_METHODS;
  apiEndpoint?: string;
  "$url.params"?: string[];
}

export type NodeRequestController =
  | string
  | RouterRequestControllerBuilderOptions;

export type MiddlewareController = void;
export type DebugConsoleController = void;

export type ResponseController = [string, any];
export type UserControllers =
  | MiddlewareController
  | ResponseController
  | DebugConsoleController;

export type RequestStack = Nodes;

export type MiddlewareStack = Array<[Node, NodesStack]>;

export interface EcoContextPayload {
  msg?: any;
  [key: string]: any;
}

export interface EcoContext extends Context {
  payload: EcoContextPayload;
  inputs?: { [key: string]: any };
  next: () => void;
}
