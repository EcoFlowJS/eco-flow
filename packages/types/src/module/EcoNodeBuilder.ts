import { FlowInputSpecs } from "../flows/index.js";
import { EcoModuleID } from "./Builders/index.js";
import { ModuleSpecs } from "./EcoModule.js";

/**
 * Interface for an EcoNodeBuilder that defines a method to build nodes asynchronously.
 */
export interface EcoNodeBuilder {
  /**
   * Asynchronously builds an array of ModuleNodes by extracting nodes from different sources
   * and setting up event listeners for systemSocket connections.
   * @returns {Promise<ModuleNodes[]>} A promise that resolves to an array of ModuleNodes.
   */
  buildNodes(): Promise<ModuleNodes[]>;
}

/**
 * Interface representing a module with additional properties.
 * @interface ModuleNodes
 * @extends ModuleSpecs
 * @property {EcoModuleID} id - The ID of the module.
 * @property {FlowInputSpecs[]} [inputs] - An array of input specifications for the module.
 */
export interface ModuleNodes extends ModuleSpecs {
  id: EcoModuleID;
  inputs?: FlowInputSpecs[];
}

/**
 * Interface representing extracted raw nodes from different parts of the application.
 * @property {ModuleNodes[]} [requestNodes] - An array of ModuleNodes representing the requested nodes.
 * @property {ModuleNodes[]} [middlewareNodes] - An array of ModuleNodes representing the middleware nodes.
 * @property {ModuleNodes[]} [responseNodes] - An array of ModuleNodes representing the response nodes.
 * @property {ModuleNodes[]} [consoleNodes] - An array of ModuleNodes representing the console nodes.
 */
export interface ExtractedRawNodes {
  requestNodes: ModuleNodes[];
  middlewareNodes: ModuleNodes[];
  responseNodes: ModuleNodes[];
  consoleNodes: ModuleNodes[];
  eventListenerNodes: ModuleNodes[];
  eventEmitterNodes: ModuleNodes[];
}

/**
 * Represents a node in the Eco system, which can be a ModuleNode or null.
 */
export type EcoNode = Readonly<ModuleNodes | null>;

/**
 * Represents an array of ModuleNodes that are read-only.
 */
export type EcoNodes = Readonly<ModuleNodes[]>;
