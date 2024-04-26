import {
  FlowsDescription,
  EcoFLowBuilder as IEcoFLowBuilder,
  NodeConfiguration,
  NodeConnections,
  Nodes,
  NodesStack,
} from "@ecoflow/types";
import stackNodes from "../helpers/stackNodes";

export class EcoFLowBuilder implements IEcoFLowBuilder {
  private _nodes: Nodes;
  private _edges: NodeConnections;
  private _configurations: NodeConfiguration[];
  private _stack: NodesStack;
  private _stacksConfigurations: NodeConfiguration[];
  private _startingNodes: Nodes;
  private _responseNodes: Nodes;
  private _consoleNodes: Nodes;

  constructor() {
    this._nodes = [];
    this._edges = [];
    this._configurations = [];
    this._stack = [];
    this._stacksConfigurations = [];
    this._startingNodes = [];
    this._responseNodes = [];
    this._consoleNodes = [];
  }

  private extractContents = (
    flowDescription: FlowsDescription
  ): [Nodes, NodeConnections, NodeConfiguration[], NodesStack] => {
    const flows = Object.keys(flowDescription);
    const nodes: Nodes = [];
    const edges: NodeConnections = [];
    const configurations: NodeConfiguration[] = [];
    const connectionLists: NodesStack = [];

    flows.map((flow) => {
      nodes.push(
        ...flowDescription[flow].definitions.filter(
          (node) => node.type !== "Request" && !node.data.disabled
        )
      );
      edges.push(
        ...flowDescription[flow].connections.filter(
          (edge) => edge.animated === false
        )
      );

      this._startingNodes = flowDescription[flow].definitions.filter(
        (node) => node.type === "Request" && !node.data.disabled
      );

      this._responseNodes = flowDescription[flow].definitions.filter(
        (node) => node.type === "Response" && !node.data.disabled
      );

      this._consoleNodes = flowDescription[flow].definitions.filter(
        (node) => node.type === "Debug" && !node.data.disabled
      );

      this._startingNodes.map((node) => {
        connectionLists.push([node]);
      });
      configurations.push(...flowDescription[flow].configurations);
    });

    this._nodes = nodes;
    this._edges = edges;
    this._configurations = configurations;
    return [nodes, edges, configurations, connectionLists];
  };

  async buildStack(
    flowConfigurations: FlowsDescription
  ): Promise<[NodesStack, NodeConfiguration[]]> {
    const { _ } = ecoFlow;
    this._stacksConfigurations = [];

    const [nodes, edges, configurations, connectionLists] =
      this.extractContents(flowConfigurations);

    this._stack = stackNodes(_.cloneDeep(connectionLists), nodes, edges);
    [...this._stack].map((node) =>
      node.map((node) => {
        const configs = configurations.filter((cfg) => cfg.nodeID === node.id);
        if (configs.length > 0) this._stacksConfigurations.push(...configs);
      })
    );

    this._stacksConfigurations = this._stacksConfigurations.filter(
      (value, index, array) => array.indexOf(value) === index
    );

    return [this._stack, this._stacksConfigurations];
  }

  getNodeConfigurations(nodeID: string): NodeConfiguration["configs"] | {} {
    const config = this._configurations.filter(
      (config) => config.nodeID === nodeID
    );
    return config.length > 0 ? config[0].configs : {};
  }
  getStackNodeConfigurations(
    nodeID: string
  ): NodeConfiguration["configs"] | {} {
    const config = this._stacksConfigurations.filter(
      (config) => config.nodeID === nodeID
    );
    return config.length > 0 ? config[0].configs : {};
  }

  get stack(): NodesStack {
    return this._stack;
  }

  get stacksConfigurations(): NodeConfiguration[] {
    return this._stacksConfigurations;
  }

  get nodes(): Nodes {
    return this._nodes;
  }

  get edges(): NodeConnections {
    return this._edges;
  }

  get configurations(): NodeConfiguration[] {
    return this._configurations;
  }

  get startingNodes(): Nodes {
    return this._startingNodes;
  }

  get responseNodes(): Nodes {
    return this._responseNodes;
  }

  get consoleNodes(): Nodes {
    return this._consoleNodes;
  }
}
