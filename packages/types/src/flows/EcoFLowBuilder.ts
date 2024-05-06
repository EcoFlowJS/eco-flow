import {
  FlowsDescription,
  NodeConfiguration,
  NodeConnections,
} from "./EcoFlowEditor";
import { Nodes } from "../module";
export type NodesStack = Nodes[];

/**
 * Interface for an EcoFlowBuilder that defines various properties and methods related to building a flow.
 * @interface EcoFLowBuilder
 * @property {NodesStack} stack - The stack of nodes in the flow.
 * @property {NodeConfiguration[]} stacksConfigurations - Configurations for the nodes in the stack.
 * @property {Nodes} nodes - All nodes in the flow.
 * @property {NodeConnections} edges - Connections between nodes.
 * @property {NodeConfiguration[]} configurations - Configurations for all nodes.
 * @property {Nodes} startingNodes - Nodes that are starting points in the flow.
 * @property {Nodes} responseNodes - Nodes that are response points in the flow.
 * @property {Nodes} console
 */
export interface EcoFLowBuilder {
  /**
   * Getter method to retrieve the NodesStack associated with this object.
   * @returns {NodesStack} The NodesStack object.
   */
  get stack(): NodesStack;

  /**
   * Getter method to retrieve the stack configurations.
   * @returns {NodeConfiguration[]} An array of NodeConfiguration objects representing the stack configurations.
   */
  get stacksConfigurations(): NodeConfiguration[];

  /**
   * Getter method to access the Nodes property of the class.
   * @returns {Nodes} The Nodes property of the class.
   */
  get nodes(): Nodes;

  /**
   * Getter method to retrieve the edges of a node.
   * @returns {NodeConnections} The edges of the node.
   */
  get edges(): NodeConnections;

  /**
   * Getter method to retrieve the configurations of the node.
   * @returns {NodeConfiguration[]} - An array of NodeConfiguration objects representing the configurations of the node.
   */
  get configurations(): NodeConfiguration[];

  /**
   * Getter method to retrieve the starting nodes of a graph.
   * @returns {Nodes} The starting nodes of the graph.
   */
  get startingNodes(): Nodes;

  /**
   * Getter method to retrieve the response nodes.
   * @returns {Nodes} The response nodes.
   */
  get responseNodes(): Nodes;

  /**
   * Getter method to access the console nodes.
   * @returns {Nodes} The console nodes.
   */
  get consoleNodes(): Nodes;

  /**
   * Builds a stack of nodes based on the given flow configurations.
   * @param {FlowsDescription} flowConfigurations - The flow configurations to build the stack from.
   * @returns {Promise<[NodesStack, NodeConfiguration[]]>} A promise that resolves to an array containing the nodes stack and node configurations.
   */
  buildStack(
    flowConfigurations: FlowsDescription
  ): Promise<[NodesStack, NodeConfiguration[]]>;

  /**
   * Retrieves the configurations for a specific node based on the node ID.
   * @param {string} nodeID - The ID of the node to retrieve configurations for.
   * @returns {NodeConfiguration["configs"] | {}} - The configurations for the specified node, or an empty object if no configurations are found.
   */
  getNodeConfigurations(nodeID: string): NodeConfiguration["configs"] | {};

  /**
   * Retrieves the configurations for a specific node in the stack.
   * @param {string} nodeID - The ID of the node to retrieve configurations for.
   * @returns {NodeConfiguration["configs"] | {}} The configurations for the specified node, or an empty object if no configurations are found.
   */
  getStackNodeConfigurations(nodeID: string): NodeConfiguration["configs"] | {};
}
