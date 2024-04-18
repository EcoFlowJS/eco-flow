import {
  FlowsConfigurations,
  FlowsEdgeDataTypes,
  FlowsNodeDataTypes,
  EcoFLowBuilder as IEcoFLowBuilder,
  ModuleTypes,
  NodeConfiguration,
  NodesStack,
} from "@ecoflow/types";
import type { Edge, Node } from "@reactflow/core";
import stackNodes from "../helpers/stackNodes";

export class EcoFLowBuilder implements IEcoFLowBuilder {
  private _nodes: Node<FlowsNodeDataTypes, ModuleTypes | string | undefined>[];
  private _edges: Edge<FlowsEdgeDataTypes>[];
  private _configurations: NodeConfiguration[];
  private _stack: NodesStack;
  private _stacksConfigurations: NodeConfiguration[];
  private _startingNodes: Node<
    FlowsNodeDataTypes,
    ModuleTypes | string | undefined
  >[];
  private _responseNodes: Node<
    FlowsNodeDataTypes,
    ModuleTypes | string | undefined
  >[];
  private _consoleNodes: Node<
    FlowsNodeDataTypes,
    ModuleTypes | string | undefined
  >[];

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
    flowConfigurations: FlowsConfigurations
  ): [
    Node<FlowsNodeDataTypes, ModuleTypes | string | undefined>[],
    Edge<FlowsEdgeDataTypes>[],
    NodeConfiguration[],
    NodesStack
  ] => {
    const flows = Object.keys(flowConfigurations);
    const nodes: Node<FlowsNodeDataTypes, ModuleTypes | string | undefined>[] =
      [];
    const edges: Edge<FlowsEdgeDataTypes>[] = [];
    const configurations: NodeConfiguration[] = [];
    const connectionLists: NodesStack = [];

    flows.map((flow) => {
      nodes.push(
        ...flowConfigurations[flow].definitions.filter(
          (node) => node.type !== "Request" && !node.data.disabled
        )
      );
      edges.push(
        ...flowConfigurations[flow].connections.filter(
          (edge) => edge.animated === false
        )
      );

      this._startingNodes = flowConfigurations[flow].definitions.filter(
        (node) => node.type === "Request" && !node.data.disabled
      );

      this._responseNodes = flowConfigurations[flow].definitions.filter(
        (node) => node.type === "Response" && !node.data.disabled
      );

      this._consoleNodes = flowConfigurations[flow].definitions.filter(
        (node) => node.type === "Debug" && !node.data.disabled
      );

      this._startingNodes.map((node) => {
        connectionLists.push([node]);
      });
      configurations.push(...flowConfigurations[flow].configurations);
    });

    this._nodes = nodes;
    this._edges = edges;
    this._configurations = configurations;
    return [nodes, edges, configurations, connectionLists];
  };

  async buildStack(
    flowConfigurations: FlowsConfigurations
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

  get nodes(): Node<FlowsNodeDataTypes, ModuleTypes | string | undefined>[] {
    return this._nodes;
  }

  get edges(): Edge<FlowsEdgeDataTypes>[] {
    return this._edges;
  }

  get configurations(): NodeConfiguration[] {
    return this._configurations;
  }

  get startingNodes(): Node<
    FlowsNodeDataTypes,
    ModuleTypes | string | undefined
  >[] {
    return this._startingNodes;
  }

  get responseNodes(): Node<
    FlowsNodeDataTypes,
    ModuleTypes | string | undefined
  >[] {
    return this._responseNodes;
  }

  get consoleNodes(): Node<
    FlowsNodeDataTypes,
    ModuleTypes | string | undefined
  >[] {
    return this._consoleNodes;
  }
}
