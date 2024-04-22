import {
  FlowsConfigurations,
  NodeConfiguration,
  NodeConnections,
} from "./EcoFlowEditor";
import { Nodes } from "../module";

export type NodesStack = Nodes[];

export interface EcoFLowBuilder {
  get stack(): NodesStack;
  get stacksConfigurations(): NodeConfiguration[];
  get nodes(): Nodes;
  get edges(): NodeConnections;
  get configurations(): NodeConfiguration[];
  get startingNodes(): Nodes;
  get responseNodes(): Nodes;
  get consoleNodes(): Nodes;

  buildStack(
    flowConfigurations: FlowsConfigurations
  ): Promise<[NodesStack, NodeConfiguration[]]>;

  getNodeConfigurations(nodeID: string): NodeConfiguration["configs"] | {};
  getStackNodeConfigurations(nodeID: string): NodeConfiguration["configs"] | {};
}
