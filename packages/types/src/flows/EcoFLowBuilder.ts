import type { Edge, Node } from "@reactflow/core";
import {
  FlowsConfigurations,
  FlowsEdgeDataTypes,
  FlowsNodeDataTypes,
  NodeConfiguration,
} from "./EcoFlowEditor";
import { ModuleTypes } from "../module";

export type NodesStack = Node<
  FlowsNodeDataTypes,
  ModuleTypes | string | undefined
>[][];

export interface EcoFLowBuilder {
  get stack(): NodesStack;
  get stacksConfigurations(): NodeConfiguration[];
  get nodes(): Node<FlowsNodeDataTypes, ModuleTypes | string | undefined>[];
  get edges(): Edge<FlowsEdgeDataTypes>[];
  get configurations(): NodeConfiguration[];
  get startingNodes(): Node<
    FlowsNodeDataTypes,
    ModuleTypes | string | undefined
  >[];
  get responseNodes(): Node<
    FlowsNodeDataTypes,
    ModuleTypes | string | undefined
  >[];
  get consoleNodes(): Node<
    FlowsNodeDataTypes,
    ModuleTypes | string | undefined
  >[];

  buildStack(
    flowConfigurations: FlowsConfigurations
  ): Promise<[NodesStack, NodeConfiguration[]]>;

  getNodeConfigurations(nodeID: string): NodeConfiguration["configs"] | {};
  getStackNodeConfigurations(nodeID: string): NodeConfiguration["configs"] | {};
}
