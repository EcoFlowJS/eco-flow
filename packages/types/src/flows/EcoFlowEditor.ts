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
import { CSSProperties, FC, HTMLAttributes } from "react";
import { EcoFLowBuilder } from "./EcoFLowBuilder";

/**
 * Interface for EcoFlowEditor that provides methods for managing flows, flow configurations,
 * flow definitions, flow connections, and flow descriptions.
 * @interface EcoFlowEditor
 */
export interface EcoFlowEditor {
  /**
   * Asynchronously retrieves a list of flows by scanning the directory for flow files.
   * @returns A Promise that resolves to an array of strings representing the flow names.
   */
  get flows(): Promise<string[]>;

  /**
   * Getter method to retrieve the IEcoFlowBuilder instance.
   * @returns {IEcoFlowBuilder} - The IEcoFlowBuilder instance.
   */
  get fLowBuilder(): EcoFLowBuilder;

  /**
   * Asynchronously retrieves the flow definitions for all flows.
   * @returns {Promise<FlowDefinitions>} A promise that resolves to an object containing the flow definitions.
   */
  getFlowDefinitions(): Promise<FlowDefinitions>;

  /**
   * Asynchronously retrieves the flow definitions for a given flow name or for all flows.
   * @param {string} [flowName] - The name of the flow to retrieve definitions for.
   * @returns {Promise<FlowDefinitions>} A promise that resolves to an object containing the flow definitions.
   */
  getFlowDefinitions(flowName?: string): Promise<FlowDefinitions>;

  /**
   * Asynchronously retrieves the flow connections for all flows.
   * @returns {Promise<FlowConnections>} A promise that resolves to an object containing flow connections.
   */
  getFlowConnections(): Promise<FlowConnections>;

  /**
   * Asynchronously retrieves the flow connections for a given flow name.
   * If no flow name is provided, retrieves connections for all flows.
   * @param {string} [flowName] - The name of the flow to retrieve connections for.
   * @returns {Promise<FlowConnections>} A promise that resolves to an object containing flow connections.
   */
  getFlowConnections(flowName?: string): Promise<FlowConnections>;

  /**
   * Retrieves the configurations for all flows if no flow name is provided.
   * @returns {Promise<FlowConfigurations>} A promise that resolves to an object containing the configurations for the specified flow.
   */
  getFlowConfigurations(): Promise<FlowConfigurations>;

  /**
   * Retrieves the configurations for a specific flow or for all flows if no flow name is provided.
   * @param {string} [flowName] - The name of the flow to retrieve configurations for.
   * @returns {Promise<FlowConfigurations>} A promise that resolves to an object containing the configurations for the specified flow.
   */
  getFlowConfigurations(flowName?: string): Promise<FlowConfigurations>;

  /**
   * Retrieves the description of all flows if no flow name is provided.
   * @returns {Promise<FlowsDescription>} A promise that resolves to an object containing the descriptions of the flow(s).
   */
  flowsDescription(): Promise<FlowsDescription>;

  /**
   * Retrieves the description of a specific flow or all flows if no flow name is provided.
   * @param {string} [flowName] - The name of the flow to retrieve the description for.
   * @returns {Promise<FlowsDescription>} A promise that resolves to an object containing the descriptions of the flow(s).
   */
  flowsDescription(flowName?: string): Promise<FlowsDescription>;

  /**
   * Checks if a flow with the given name exists.
   * @param {string} flowName - The name of the flow to check.
   * @returns {Promise<boolean>} A promise that resolves to true if the flow exists, false otherwise.
   */
  isFlow(flowName: string): Promise<boolean>;

  /**
   * Creates a new flow with the given name.
   * @param {string} flowName - The name of the flow to create.
   * @returns {Promise<void>} A promise that resolves once the flow is created.
   * @throws {string} If the flow with the given name already exists.
   */
  createFlow(flowName: string): Promise<void>;

  /**
   * Updates the flow configurations based on the provided configs and newConfigs.
   * @param {Required<Pick<configOptions, "flowDir" | "flowFilePretty" | "flowNodeConfigurations" | "flowNodeConnections" | "flowNodeDefinitions">} configs - The current flow configurations.
   * @returns {Promise<void>} A promise that resolves once the flow configurations are updated.
   */
  updateFlowConfigs(
    configs: Required<Pick<configOptions, "flowDir" | "flowFilePretty">>
  ): Promise<void>;

  /**
   * Updates the flow configurations based on the provided configs and newConfigs.
   * @param {Required<Pick<configOptions, "flowDir" | "flowFilePretty" | "flowNodeConfigurations" | "flowNodeConnections" | "flowNodeDefinitions">} configs - The current flow configurations.
   * @param {Required<Pick<configOptions, "flowNodeConfigurations" | "flowNodeConnections" | "flowNodeDefinitions">} [newConfigs] - The new flow configurations to update.
   * @returns {Promise<void>} A promise that resolves once the flow configurations are updated.
   */
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

  /**
   * Removes a flow with the given name.
   * @param {string} flowName - The name of the flow to be removed.
   * @returns {Promise<void>} A promise that resolves once the flow is successfully removed.
   * @throws {string} If the flow does not exist.
   */
  removeFlow(flowName: string): Promise<void>;

  /**
   * Asynchronously initializes the object and deploys the existing flow.
   * @returns {Promise<this>} A Promise that resolves to the initialized object.
   */
  initialize(): Promise<this>;

  /**
   * Checks if all nodes in the given FlowDefinitions or FlowsDescription are configured.
   * @param {FlowDefinitions | FlowsDescription} definitions - The definitions of the flow or description.
   * @returns {boolean} True if all nodes are configured, false otherwise.
   */
  isAllNodesConfigured(
    definitions: FlowDefinitions | FlowsDescription
  ): boolean;

  /**
   * Checks if a given node is configured.
   * @param {Node} node - The node to check.
   * @returns {boolean} True if the node is configured, false otherwise.
   */
  isNodeConfigured(node: Node): boolean;

  /**
   * Asynchronously deploys a flow based on the provided flow description.
   * @param {FlowsDescription} flowDescription - The description of the flow to deploy.
   * @returns {Promise<boolean>} A promise that resolves to true if the deployment is successful.
   * @throws {Error} If there is an error during the deployment process.
   */
  deploy(flowDescription: FlowsDescription): Promise<boolean>;
}

/**
 * Represents the configuration for a node in the system.
 * @interface NodeConfiguration
 * @property {string} nodeID - The unique identifier for the node.
 * @property {Object.<string, any>} configs - The configuration settings for the node.
 */
export interface NodeConfiguration {
  nodeID: string;
  configs: {
    [key: string]: any;
  };
}

/**
 * Interface representing flow definitions with keys as strings and values as Nodes.
 */
export interface FlowDefinitions {
  [key: string]: Nodes;
}

/**
 * Interface representing flow connections between nodes.
 * @interface FlowConnections
 * @property {Edge<FlowsEdgeDataTypes>[]} - An array of edges for each node key.
 */
export interface FlowConnections {
  [key: string]: Edge<FlowsEdgeDataTypes>[];
}

/**
 * Interface representing flow configurations.
 * @interface FlowConfigurations
 * @property {NodeConfiguration[]} value - An array of NodeConfiguration objects.
 */
export interface FlowConfigurations {
  [key: string]: NodeConfiguration[];
}

/**
 * Interface for defining a mapping of flow keys to descriptions.
 */
export interface FlowsDescription {
  [key: string]: Descriptions;
}

/**
 * Interface representing descriptions containing definitions, connections, and configurations.
 * @interface Descriptions
 * @property {Nodes} definitions - The nodes definitions.
 * @property {Edge<FlowsEdgeDataTypes>[]} connections - The connections between nodes.
 * @property {NodeConfiguration[]} configurations - The configurations of the nodes.
 */
export interface Descriptions {
  definitions: Nodes;
  connections: Edge<FlowsEdgeDataTypes>[];
  configurations: NodeConfiguration[];
}

/**
 * Interface for defining the appearance configurations of a node.
 * @interface NodeAppearanceConfigurations
 * @property {boolean} [label] - Whether to display a label for the node.
 * @property {string | null} [icon] - The icon to display for the node.
 * @property {Object} [portLabel] - Configuration for port labels.
 * @property {string} [portLabel.input] - Label for the input port.
 * @property {string} [portLabel.output] - Label for the output port.
 */
export interface NodeAppearanceConfigurations {
  label?: boolean;
  icon?: string | null;
  portLabel?: {
    input?: string;
    output?: string;
  };
}

/**
 * Interface for defining the data types for FlowsEdgeData.
 */
export interface FlowsEdgeDataTypes {
  forcedDisabled: false;
}

/**
 * Interface representing the data types for a Flows Node.
 * @interface FlowsNodeDataTypes
 * @property {EcoModuleID} moduleID - The ID of the EcoModule.
 * @property {string} label - The label of the node.
 * @property {boolean} configured - Indicates if the node is configured.
 * @property {boolean} disabled - Indicates if the node is disabled.
 * @property {string} description - The description of the node.
 * @property {NodeAppearanceConfigurations} appearance - The appearance configurations of the node.
 * @property {FC<HTMLAttributes<SVGElement>>} [icon] - Optional icon component for the node.
 * @property {number | boolean} [isConnectable] - Indicates if the node is connected.
 * @property {number | boolean} [isError] - Indicates if the node is connected has any errors.
 * @property {number | boolean} [openDrawer.isOpen] - Indicates if the node is open.
 * @property {number | boolean} [openDrawer.configured] - Indicates if the node is configured.
 * @property {number | boolean} [openDrawer.disabled] - Indicates if the node is disabled.
 * @property {number | boolean} [openDrawer.descriptions] - Indicates the node is descriptions.
 * @property {number | boolean} [openDrawer.appearance] - Indicates the node is appearance configuration.
 */
export interface FlowsNodeDataTypes {
  moduleID: EcoModuleID;
  label: string;
  configured: boolean;
  disabled: boolean;
  description: string;
  appearance: NodeAppearanceConfigurations;
  color?: CSSProperties["backgroundColor"];
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

/**
 * Interface for defining the configurations of a flows drawer.
 * @property {boolean} show - Indicates whether the drawer should be shown.
 * @property {string | undefined} nodeID - The ID of the node.
 * @property {EcoModuleID} moduleID - The ID of the Eco module.
 * @property {string} label - The label of the drawer.
 * @property {boolean} configured - Indicates whether the drawer is configured.
 * @property {boolean} disabled - Indicates whether the drawer is disabled.
 * @property {string} description - The description of the drawer.
 * @property {NodeAppearanceConfigurations} appearance - The appearance configurations of the node.
 * @property {NodeConfiguration} nodeConfiguration - The configuration of the node.
 */
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

/**
 * Interface representing the configuration settings for a Flow Editor.
 * @property {boolean} keyboardAccessibility - Enable/Disable keyboard interactions.
 * @property {boolean} controls - Enable/Diable flow editor controls.
 * @property {boolean} miniMap - Enable/Diabled mini map in flow editor.
 * @property {boolean} panMiniMap - Enable/Diable mini map panning in flow editor.
 * @property {boolean} scrollPan - Enable/Diable scroll to pan.
 */
export interface FlowEditorSettingsConfigurations {
  keyboardAccessibility: boolean;
  controls: boolean;
  miniMap: boolean;
  panMiniMap: boolean;
  scrollPan: boolean;
}

/**
 * Represents the specifications for an input in a flow.
 * @interface FlowInputSpecs
 * @property {string} name - The name of the input.
 * @property {string} label - The label for the input.
 * @property {string} hint - The hint for the input.
 * @property {ModuleSpecsInputsTypes} type - The type of the input.
 * @property {boolean} [required] - Indicates if the input is required.
 * @property {string} [codeLanguage] - The programming language for the input.
 * @property {API_METHODS[]} [methods] - The API methods associated with the input.
 * @property {string | string[]} [radioValues] - The values for radio inputs.
 * @property {string[] | ModuleSpecsInputsTypeOptions} [pickerOptions] - The options for the input type Select Picker.
 * @property {boolean} [listBoxSorting] - Indicates if the input is a list box is sortable.
 * @property {string | number | boolean | Date | string[] | { start: number; end: number }} [defaultValue] - Indicates if the input is a default value.
 */
export interface FlowInputSpecs {
  name: string;
  label: string;
  type: ModuleSpecsInputsTypes;
  hint?: string;
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

/**
 * Represents a connection between nodes in a graph.
 * @type {Edge<FlowsEdgeDataTypes>}
 */
export type NodeConnection = Edge<FlowsEdgeDataTypes>;

/**
 * Represents an array of NodeConnection objects.
 */
export type NodeConnections = NodeConnection[];
