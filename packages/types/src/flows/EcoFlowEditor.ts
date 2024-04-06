import type { Connection, Node } from "@reactflow/core";
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
  [key: string]: Node;
}

export interface FlowConnections {
  [key: string]: Connection;
}

export interface FlowConfigurations {
  [key: string]: NodeConfiguration;
}

export interface FlowsDescription {
  [key: string]: Describtions;
}

export interface Describtions {
  definitions: Node;
  connections: Connection;
  configurations: NodeConfiguration;
}

export interface FlowRenameConfigurations {
  oldName: string;
  newName: string;
}

export interface RemoveNodesConfiguration {
  flowName: string;
  nodes: Node[];
}

export interface NodesConfiguration {
  flowName: string;
  nodes: Node[];
}

export interface RemoveConnectionConfiguration {
  flowName: string;
  connections: Connection[];
}

export interface ConnectionConfiguration {
  flowName: string;
  connections: Connection[];
}

export interface DeploymentConfigurations {
  //Flow Configuration
  flows?: string[];
  removedFlows?: string[];
  renamedFlows?: FlowRenameConfigurations[];
  addFlows?: string[];

  //Node Descripotion Configuration
  nodes?: NodesConfiguration[];

  //Connection Configuration
  connections?: ConnectionConfiguration[];
}
