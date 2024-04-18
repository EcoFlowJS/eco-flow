import type { Edge, Node } from "@reactflow/core";
import {
  FlowsConfigurations,
  FlowsDataTypes,
  NodeConfiguration,
} from "./EcoFlowEditor";
import { ModuleTypes } from "../module";

export type NodesStack = Node<FlowsDataTypes, ModuleTypes>[][];

export interface EcoFLowBuilder {
  get stack(): NodesStack;
  get stacksConfigurations(): NodeConfiguration[];
  get nodes(): Node<FlowsDataTypes, ModuleTypes>[];
  get edges(): Edge[];
  get configurations(): NodeConfiguration[];
  get startingNodes(): Node<FlowsDataTypes, ModuleTypes>[];
  get responseNodes(): Node<FlowsDataTypes, ModuleTypes>[];
  get consoleNodes(): Node<FlowsDataTypes, ModuleTypes>[];

  buildStack(
    flowConfigurations: FlowsConfigurations
  ): Promise<[NodesStack, NodeConfiguration[]]>;

  getNodeConfigurations(nodeID: string): NodeConfiguration["configs"] | {};
  getStackNodeConfigurations(nodeID: string): NodeConfiguration["configs"] | {};
}
