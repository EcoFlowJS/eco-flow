import { Context, Middleware } from "koa";
import { FlowsNodeDataTypes, NodeConfiguration, NodesStack } from "../flows";
import { API_METHODS, Node, Nodes } from "../module";
import { Routes } from "./common";

/**
 * Interface for building an EcoAPI router.
 */
export interface EcoAPIRouterBuilder {
  /**
   * Asynchronously initializes the Eco API Router Builder by generating route configurations
   * based on the request and middleware stacks. It then maps the generated route configurations
   * to create route objects with path, method type, method, and controller properties.
   * @returns {Promise<IEcoAPIRouterBuilder>} A promise that resolves to the initialized Eco API Router Builder.
   */
  initializeBuilder(): Promise<EcoAPIRouterBuilder>;

  /**
   * Getter method to retrieve the routes array.
   * @returns {Routes[]} - An array of Routes objects.
   */
  get routes(): Routes[];

  /**
   * Getter method to retrieve the NodesStack object stored in the nodeStack property.
   * @returns {NodesStack} The NodesStack object stored in the nodeStack property.
   */
  get nodeStack(): NodesStack;

  /**
   * Getter method to retrieve the configurations of the node.
   * @returns {NodeConfiguration[]} - An array of NodeConfiguration objects.
   */
  get configurations(): NodeConfiguration[];
}

/**
 * Interface for defining options to build a router request controller.
 * @param {API_METHODS} [apiMethod] - The API method to be used for the request.
 * @param {string} [apiEndpoint] - The API endpoint to send the request to.
 * @param {string[]} ["$url.params"] - An array of URL parameters for the request.
 */
export interface RouterRequestControllerBuilderOptions {
  apiMethod?: API_METHODS;
  apiEndpoint?: string;
  "$url.params"?: string[];
}

/**
 * Represents a NodeRequestController, which can be either a string or a RouterRequestControllerBuilderOptions.
 */
export type NodeRequestController =
  | string
  | RouterRequestControllerBuilderOptions;

/**
 * MiddlewareController type definition.
 * This type is used to represent a middleware controller in the application.
 */
export type MiddlewareController = void;

/**
 * Represents a type alias for a DebugConsoleController, which is void.
 */
export type DebugConsoleController = void;

/**
 * Defines a ResponseController type, which is a tuple containing a string and any type of value.
 */
export type ResponseController = [string, any];

/**
 * Defines a type that can be one of three controller types: MiddlewareController,
 * ResponseController, or DebugConsoleController.
 */
export type UserControllers =
  | MiddlewareController
  | ResponseController
  | DebugConsoleController;

/**
 * RequestStack is a type alias for Nodes.
 * Nodes represent a collection of nodes in a stack data structure.
 */
export type RequestStack = Nodes;

/**
 * Represents a middleware stack as an array of tuples, where each tuple consists of a Node
 * and a NodesStack.
 */
export type MiddlewareStack = Array<[Node, NodesStack]>;

/**
 * Interface for the payload of an EcoContext, which can contain any key-value pairs.
 * @param {any} msg - Optional message field in the payload.
 * @param {any} [key: string] - Additional key-value pairs that can be included in the payload.
 */
export interface EcoContextPayload {
  msg?: any;
  [key: string]: any;
}

/**
 * Interface for the EcoContext, extending the Context interface.
 * @interface EcoContext
 * @extends Context
 * @property {EcoContextPayload} payload - The payload of the EcoContext.
 * @property {FlowsNodeDataTypes} [moduleDatas] - Optional module datas for the EcoContext.
 * @property {Object.<string, any>} [inputs] - Optional inputs for the EcoContext.
 * @property {Function} next - A function to proceed to the next step in the EcoContext.
 */
export interface EcoContext extends Context {
  payload: EcoContextPayload;
  moduleDatas?: FlowsNodeDataTypes;
  inputs?: { [key: string]: any };
  next: () => void;
}
