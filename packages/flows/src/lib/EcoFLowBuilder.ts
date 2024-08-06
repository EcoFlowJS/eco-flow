import {
  FlowsDescription,
  EcoFLowBuilder as IEcoFLowBuilder,
  NodeConfiguration,
  NodeConnections,
  Nodes,
  NodesStack,
} from "@ecoflow/types";
import stackNodes from "../helpers/stackNodes";

/**
 * Class representing an EcoFlowBuilder that builds and manages a flow of nodes and connections.
 */
export class EcoFLowBuilder implements IEcoFLowBuilder {
  private _nodes: Nodes;
  private _edges: NodeConnections;
  private _configurations: NodeConfiguration[];
  private _stack: NodesStack;
  private _stacksConfigurations: NodeConfiguration[];
  private _startingNodes: Nodes;
  private _responseNodes: Nodes;
  private _consoleNodes: Nodes;
  private _emitterNodes: Nodes;

  /**
   * Constructor for a graph object.
   * Initializes the graph with empty arrays for nodes, edges, configurations, stack,
   * stacksConfigurations, startingNodes, responseNodes, and consoleNodes.
   */
  constructor() {
    this._nodes = [];
    this._edges = [];
    this._configurations = [];
    this._stack = [];
    this._stacksConfigurations = [];
    this._startingNodes = [];
    this._responseNodes = [];
    this._consoleNodes = [];
    this._emitterNodes = [];
  }

  /**
   * Extracts contents from the given flows description and returns nodes, edges, configurations, and connection lists.
   * @param {FlowsDescription} flowDescription - The flows description object containing nodes, connections, and configurations.
   * @returns A tuple containing nodes, edges, configurations, and connection lists.
   */
  private extractContents = (
    flowDescription: FlowsDescription
  ): [Nodes, NodeConnections, NodeConfiguration[], NodesStack] => {
    const flows = Object.keys(flowDescription);
    const nodes: Nodes = [];
    const edges: NodeConnections = [];
    const configurations: NodeConfiguration[] = [];
    const connectionLists: NodesStack = [];

    /**
     * Maps through the flows and populates the nodes and edges arrays based on the flowDescription.
     * Also sets the startingNodes, responseNodes, and consoleNodes arrays based on the flowDescription.
     * @param {Array} flows - An array of flows to iterate through.
     * @returns None
     */
    flows.map((flow) => {
      /**
       * Pushes non-disabled nodes of a specific type from the flow definitions array into the nodes array.
       * @param {string} flow - The flow identifier.
       * @param {Array} nodes - The array to push the filtered nodes into.
       * @param {Array} flowDescription - The object containing flow definitions.
       * @returns None
       */
      nodes.push(
        ...flowDescription[flow].definitions.filter(
          (node) =>
            node.type !== "Request" &&
            node.type !== "EventListener" &&
            !node.data.disabled
        )
      );

      /**
       * Pushes non-animated edges from the specified flow connections into the 'edges' array.
       * @param {Array} edges - The array to push the non-animated edges into.
       * @param {Object} flowDescription - The description of the flow containing connections.
       * @param {string} flow - The specific flow to extract connections from.
       * @returns None
       */
      edges.push(
        ...flowDescription[flow].connections.filter(
          (edge) => edge.animated === false
        )
      );

      /**
       * Filters the starting nodes from the flow description based on the node type being "Request"
       * and the node not being disabled.
       * @param {string} flow - The flow for which starting nodes are to be filtered.
       * @param {Array} flowDescription - The array containing the flow description.
       * @returns {Array} An array of starting nodes that meet the filter criteria.
       */
      this._startingNodes = flowDescription[flow].definitions.filter(
        (node) =>
          (node.type === "Request" || node.type === "EventListener") &&
          !node.data.disabled
      );

      /**
       * Filters the response nodes from the flow description based on the node type being "Response"
       * and the node not being disabled.
       * @param {string} flow - The flow for which response nodes are being filtered.
       * @param {Array} flowDescription - The array containing the flow description.
       * @returns {Array} An array of response nodes that meet the filter criteria.
       */
      this._responseNodes = flowDescription[flow].definitions.filter(
        (node) => node.type === "Response" && !node.data.disabled
      );

      /**
       * Filters the nodes in the flow description based on type and disabled status.
       * @param {string} flow - The flow to filter nodes from.
       * @param {Array} flowDescription - The array of flow descriptions.
       * @returns An array of console nodes that are of type "Debug" and not disabled.
       */
      this._consoleNodes = flowDescription[flow].definitions.filter(
        (node) => node.type === "Debug" && !node.data.disabled
      );

      this._emitterNodes = flowDescription[flow].definitions.filter(
        (node) => node.type === "EventEmitter" && !node.data.disabled
      );

      /**
       * Maps over the starting nodes and creates a connection list for each node.
       * Each connection list contains only the starting node.
       * @returns None
       */
      this._startingNodes.map((node) => {
        connectionLists.push([node]);
      });

      /**
       * Pushes all configurations from a specific flow in a flowDescription object into an array.
       * @param {Array} configurations - The array to push the configurations into.
       * @param {string} flow - The specific flow in the flowDescription object.
       * @param {Object} flowDescription - The object containing flow descriptions.
       * @returns None
       */
      configurations.push(...flowDescription[flow].configurations);
    });

    this._nodes = nodes.map((node) => ({ ...node, selected: false }));
    this._edges = edges.map((edge) => ({ ...edge, selected: false }));
    this._configurations = configurations;
    return [this._nodes, this._edges, configurations, connectionLists];
  };

  /**
   * Builds a stack of nodes based on the given flow configurations.
   * @param {FlowsDescription} flowConfigurations - The flow configurations to build the stack from.
   * @returns {Promise<[NodesStack, NodeConfiguration[]]>} A promise that resolves to an array containing the nodes stack and node configurations.
   */
  async buildStack(
    flowConfigurations: FlowsDescription
  ): Promise<[NodesStack, NodeConfiguration[]]> {
    const { _ } = ecoFlow;
    this._stacksConfigurations = [];

    /**
     * Extracts contents from the given flow configurations object and assigns them to
     * variables for nodes, edges, configurations, and connection lists.
     * @param {FlowConfigurations} flowConfigurations - The flow configurations object to extract contents from.
     * @returns An array containing nodes, edges, configurations, and connection lists.
     */
    const [nodes, edges, configurations, connectionLists] =
      this.extractContents(flowConfigurations);

    /**
     * Initializes the stack by creating a deep copy of the connection lists and then
     * stacking the nodes based on the given nodes and edges.
     * It also filters configurations based on the node ID and adds them to the stack's configurations.
     * @param {Array} connectionLists - The connection lists to clone and stack.
     * @param {Array} nodes - The nodes to stack.
     * @param {Array} edges - The edges to stack.
     * @returns None
     */
    this._stack = stackNodes(_.cloneDeep(connectionLists), nodes, edges);
    [...this._stack].map((node) =>
      node.map((node) => {
        const configs = configurations.filter((cfg) => cfg.nodeID === node.id);
        if (configs.length > 0) this._stacksConfigurations.push(...configs);
      })
    );

    /**
     * Filters out duplicate values from the stacks configurations array.
     * @returns None
     */
    this._stacksConfigurations = this._stacksConfigurations.filter(
      (value, index, array) => array.indexOf(value) === index
    );

    return [this._stack, this._stacksConfigurations];
  }

  /**
   * Retrieves the configurations for a specific node based on the node ID.
   * @param {string} nodeID - The ID of the node to retrieve configurations for.
   * @returns {NodeConfiguration["configs"] | {}} - The configurations for the specified node, or an empty object if no configurations are found.
   */
  getNodeConfigurations(nodeID: string): NodeConfiguration["configs"] | {} {
    const config = this._configurations.filter(
      (config) => config.nodeID === nodeID
    );
    return config.length > 0 ? config[0].configs : {};
  }

  /**
   * Retrieves the configurations for a specific node in the stack.
   * @param {string} nodeID - The ID of the node to retrieve configurations for.
   * @returns {NodeConfiguration["configs"] | {}} The configurations for the specified node, or an empty object if no configurations are found.
   */
  getStackNodeConfigurations(
    nodeID: string
  ): NodeConfiguration["configs"] | {} {
    const config = this._stacksConfigurations.filter(
      (config) => config.nodeID === nodeID
    );
    return config.length > 0 ? config[0].configs : {};
  }

  /**
   * Getter method to retrieve the NodesStack associated with this object.
   * @returns {NodesStack} The NodesStack object.
   */
  get stack(): NodesStack {
    return this._stack;
  }

  /**
   * Getter method to retrieve the stack configurations.
   * @returns {NodeConfiguration[]} An array of NodeConfiguration objects representing the stack configurations.
   */
  get stacksConfigurations(): NodeConfiguration[] {
    return this._stacksConfigurations;
  }

  /**
   * Getter method to access the Nodes property of the class.
   * @returns {Nodes} The Nodes property of the class.
   */
  get nodes(): Nodes {
    return this._nodes;
  }

  /**
   * Getter method to retrieve the edges of a node.
   * @returns {NodeConnections} The edges of the node.
   */
  get edges(): NodeConnections {
    return this._edges;
  }

  /**
   * Getter method to retrieve the configurations of the node.
   * @returns {NodeConfiguration[]} - An array of NodeConfiguration objects representing the configurations of the node.
   */
  get configurations(): NodeConfiguration[] {
    return this._configurations;
  }

  /**
   * Getter method to retrieve the starting nodes of a graph.
   * @returns {Nodes} The starting nodes of the graph.
   */
  get startingNodes(): Nodes {
    return this._startingNodes;
  }

  /**
   * Getter method to retrieve the response nodes.
   * @returns {Nodes} The response nodes.
   */
  get responseNodes(): Nodes {
    return this._responseNodes;
  }

  /**
   * Getter method to access the console nodes.
   * @returns {Nodes} The console nodes.
   */
  get consoleNodes(): Nodes {
    return this._consoleNodes;
  }

  /**
   * Getter method to retrieve the emitter nodes.
   * @returns {Nodes} The emitter nodes.
   */
  get emitterNodes(): Nodes {
    return this._emitterNodes;
  }
}
