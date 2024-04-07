import type { Edge, Node } from "@reactflow/core";
import { configOptions } from "../ecoflow";

export interface EcoFlowEditor {
  get flows(): Promise<string[]>;
  getFlowDefinitions(): Promise<FlowDefinitions>;
  getFlowDefinitions(flowName?: string): Promise<FlowDefinitions>;

  getFlowConnections(): Promise<FlowConnections>;
  getFlowConnections(flowName?: string): Promise<FlowConnections>;

  getFlowConfigurations(): Promise<FlowConfigurations>;
  getFlowConfigurations(flowName?: string): Promise<FlowConfigurations>;

  flowsDescription(): Promise<FlowsDescription>;
  flowsDescription(flowName?: string): Promise<FlowsDescription>;

  isFlow(flowName: string): Promise<boolean>;

  createFlow(flowName: string): Promise<void>;
  updateFlowConfigs(
    configs: Required<Pick<configOptions, "flowDir" | "flowFilePretty">>
  ): Promise<void>;
  updateFlowConfigs(
    configs: Required<
      Pick<
        configOptions,
        "flowNodeConfigurations" | "flowNodeConnections" | "flowNodeDefinitions"
      >
    >,
    newConfigs?: Required<
      Pick<
        configOptions,
        "flowNodeConfigurations" | "flowNodeConnections" | "flowNodeDefinitions"
      >
    >
  ): Promise<void>;
  removeFlow(flowName: string): Promise<void>;

  build(): Promise<this>;
}

export type NodeConfiguration = any;

export interface FlowDefinitions {
  [key: string]: Node[];
}

export interface FlowConnections {
  [key: string]: Edge[];
}

export interface FlowConfigurations {
  [key: string]: NodeConfiguration[];
}

export interface FlowsDescription {
  [key: string]: Describtions;
}

export interface Describtions {
  definitions: Node[];
  connections: Edge[];
  configurations: NodeConfiguration[];
}

export interface FlowsConfigurations {
  [key: string]: Describtions;
}
