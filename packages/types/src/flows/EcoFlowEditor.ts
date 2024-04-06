import type { Connection, Node } from "@reactflow/core";
import { configOptions } from "../ecoflow";

export interface EcoFlowEditor {
  get flows(): Promise<string[]>;
  flowsDescription(flowName?: string): Promise<FlowsDescription | null>;
  isFlow(flowName: string): Promise<boolean>;
  createFlow(flowName: string): Promise<boolean>;
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
  removeFlow(flowName: string): Promise<boolean>;
  build(): Promise<this>;
}

export interface FlowsDescription {
  [key: string]: Describtions;
}

export interface Describtions {
  definitions: Node;
  connections: Connection;
  configurations: any;
}
