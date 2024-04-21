import { FlowsNodeDataTypes, NodesStack } from "../flows";
import { API_METHODS, Node, Nodes } from "../module";

export interface EcoAPIRouterBuilder {
  initializeBuilder(): Promise<EcoAPIRouterBuilder>;
}

export interface RouterRequestControllerBuilder {
  apiMethod?: API_METHODS;
  apiEndpoint?: string;
  "$url.params"?: string[];
}

export type NodeRequestController = string | RouterRequestControllerBuilder;

export type RequestStack = Nodes;

export type MiddlewareStack = Array<[Node, NodesStack]>;
