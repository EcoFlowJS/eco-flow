import type { Edge } from "@reactflow/core";
import { configOptions } from "../ecoflow";
import {
  API_METHODS,
  EcoModuleID,
  ModuleSpecsInputsTypeOptions,
  ModuleSpecsInputsTypes,
  Node,
  Nodes,
} from "../module";
import { FC, HTMLAttributes } from "react";
import { EcoFLowBuilder } from "./EcoFLowBuilder";

export interface EcoFlowEditor {
  get flows(): Promise<string[]>;
  get fLowBuilder(): EcoFLowBuilder;

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

  initialize(): Promise<this>;
  isAllNodesConfigured(
    definitions: FlowDefinitions | FlowsDescription
  ): boolean;
  isNodeConfigured(node: Node): boolean;
  deploy(flowDescription: FlowsDescription): Promise<boolean>;
}

export interface NodeConfiguration {
  nodeID: string;
  configs: {
    [key: string]: any;
  };
}

export interface FlowDefinitions {
  [key: string]: Nodes;
}

export interface FlowConnections {
  [key: string]: Edge<FlowsEdgeDataTypes>[];
}

export interface FlowConfigurations {
  [key: string]: NodeConfiguration[];
}

export interface FlowsDescription {
  [key: string]: Describtions;
}

export interface Describtions {
  definitions: Nodes;
  connections: Edge<FlowsEdgeDataTypes>[];
  configurations: NodeConfiguration[];
}

export interface NodeAppearanceConfigurations {
  label?: boolean;
  icon?: string | null;
  portLabel?: {
    input?: string;
    output?: string;
  };
}

export interface FlowsEdgeDataTypes {
  forcedDisabled: false;
}

export interface FlowsNodeDataTypes {
  moduleID: EcoModuleID;
  label: string;
  configured: boolean;
  disabled: boolean;
  description: string;
  appearance: NodeAppearanceConfigurations;
  icon?: FC<HTMLAttributes<SVGElement>>;
  isConnectable?: number | boolean;
  isError?: boolean;
  openDrawer?: (
    label: string,
    configured: boolean,
    disabled: boolean,
    description: string,
    appearance: NodeAppearanceConfigurations
  ) => void;
}

export interface FlowsConfigurationsDrawer {
  show: boolean;
  nodeID?: string;
  moduleID?: EcoModuleID;
  label?: string;
  configured?: boolean;
  disabled?: boolean;
  description?: string;
  appearance?: NodeAppearanceConfigurations;
  nodeConfiguration?: NodeConfiguration;
}

export interface FlowEditorSettingsConfigurations {
  keyboardAccessibility: boolean;
  controls: boolean;
  miniMap: boolean;
  panMiniMap: boolean;
  scrollPan: boolean;
}

export interface FlowInputSpecs {
  name: string;
  label: string;
  type: ModuleSpecsInputsTypes;
  required?: boolean;
  codeLanguage?: string;
  methods?: API_METHODS[];
  radioValues?: string | string[];
  pickerOptions?: string[] | ModuleSpecsInputsTypeOptions[];
  listBoxSorting?: boolean;
  defaultValue?:
    | string
    | number
    | boolean
    | Date
    | string[]
    | { start: number; end: number };
}

export type NodeConnection = Edge<FlowsEdgeDataTypes>;
export type NodeConnections = NodeConnection[];
