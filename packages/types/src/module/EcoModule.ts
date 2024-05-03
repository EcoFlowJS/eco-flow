import { PackageSearchResult, Person } from "query-registry";
import { EcoModuleBuilder } from "./EcoModuleBuilder";
import { EcoModuleID } from "./Builders/EcoModuleID";
import { ModuleSchema } from "./ModuleSchema";
import {
  EcoNodeBuilder,
  ModuleNodes,
  EcoNode,
  EcoNodes,
} from "./EcoNodeBuilder";
import { Node as ReactFlowNode } from "@reactflow/core";
import { FlowsNodeDataTypes } from "../flows";

export interface EcoModule {
  registerModules(): Promise<void>;
  isEcoModule(moduleName: PackageSearchResult): Promise<boolean>;
  isEcoModule(moduleName: string): Promise<boolean>;
  searchModule(moduleName: string): Promise<ModuleSearchResults>;
  installModule(moduleName: string): Promise<ModuleSchema>;
  installModule(moduleName: string, version?: string): Promise<ModuleSchema>;
  installLocalModule(moduleName: string[]): Promise<ModuleSchema[]>;
  upgradeDowngradeModule(
    moduleName: string,
    version: string
  ): Promise<ModuleSchema>;
  removeModule(moduleName: string): Promise<void>;
  addModule(module: ModuleSchema | ModuleSchema[]): Promise<void>;
  updateModule(module: ModuleSchema | ModuleSchema[]): Promise<void>;
  dropModule(moduleID: EcoModuleID | EcoModuleID[]): Promise<void>;
  getModuleSchema(): ModuleSchema[];
  getModuleSchema(moduleID?: EcoModuleID): ModuleSchema;
  getModuleSchema(moduleID?: string): ModuleSchema;
  getModule(): Module[];
  getModule(moduleID?: string): Module | null;
  getNodes(): Promise<EcoNodes>;
  getNodes(nodeID?: string): Promise<EcoNode | null>;
  getNodes(
    nodeID?: string,
    inputValuePass?: { [key: string]: any }
  ): Promise<EcoNode | null>;
  getInstalledPackagesDescription(
    packageName: string
  ): Promise<InstalledPackagesDescription>;

  get availablePackagesCounts(): Promise<Number>;
  get moduleBuilder(): EcoModuleBuilder;
  get getNodeBuilder(): EcoNodeBuilder | null;
  get installedModules(): Promise<string[]>;
}

export interface ModuleSearchResults {
  modules: ModuleResults[];
  total: number;
}

export interface ModuleResults {
  name: string;
  author?: Person | string;
  versions: string[];
  isInstalled: boolean;
  inUsed: boolean;
  latestVersion: string;
  installedVersions: string | null;
  gitRepository?: string;
}

export type ModuleTypes = "Request" | "Middleware" | "Response" | "Debug"; // Modle node types;

export type ModuleSpecsInputsTypes =
  | "Route" // Default value for Request Node Types
  | "DB_Selector" // Default value for DB Selectors
  | "Methods" // Request Node API Methods
  | "Code" // Code Editor Input Type
  | "Toggle" // Toggle Input Type
  | "Date" // Date Input Type
  | "Time" // Time Input Type
  | "DateTime" // Date Time Input Type
  | "Number" // Number Input Type
  | "String" // Text Input Type (DEFAULT VALUE)
  | "HiddenString" // Password Input Type
  | "CheckPicker" // List Picker Input Type
  | "SelectPicker" // Select Picker Input Type
  | "Checkbox" // Checkbox Input Type
  | "Radio" // Radio Input Type
  | "Range" // Range or Slider Input Type
  | "ListBox"; // List Box Input Type

export type API_METHODS = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; // Available API Methods;
export type DebugOutput = "Message" | "Complete" | "Expression";
export type DebugConsole = "WebConsole" | "Terminal";
export type Response = { [key: string]: any };

export interface ModuleSpecsInputsTypeOptions {
  name: string;
  value: string;
}

export interface InstalledPackagesDescription {
  name: string;
  currentVersion: string;
  latestVersion: string;
  author: string | Person;
  download: number | string;
  isInUse: boolean;
  isLocalPackage: boolean;
}

export interface CurrentPackageDescription {
  name: string;
  version: string;
  isInUse: boolean;
  isLocalPackage: boolean;
}

export interface ModuleSpecsInputs {
  name: string;
  label: string;
  type: ModuleSpecsInputsTypes;
  required?: boolean;
  methods?: API_METHODS[] | ((value?: { [key: string]: any }) => API_METHODS[]);
  radioValues?:
    | string
    | string[]
    | ((value?: { [key: string]: any }) => string | string[]);
  pickerOptions?:
    | string[]
    | ModuleSpecsInputsTypeOptions[]
    | ((value?: {
        [key: string]: any;
      }) => string[] | ModuleSpecsInputsTypeOptions[]);
  listBoxSorting?: boolean;
  defaultValue?:
    | string
    | number
    | boolean
    | Date
    | string[]
    | { start: number; end: number }
    | ((value?: {
        [key: string]: any;
      }) =>
        | string
        | number
        | boolean
        | Date
        | string[]
        | { start: number; end: number });
}

export interface ModuleSpecs {
  name: string;
  type: ModuleTypes;
  describtion?: string;
  controller?: string | (() => string | { [key: string]: any });
}

export interface ManifestSpecs extends ModuleSpecs {
  inputs?: ModuleSpecsInputs[];
}

export interface Module {
  id: EcoModuleID;
  name: string;
  packageName: string;
  version: string;
  nodes: ModuleNodes[];
}

export type Modules = Module[];

export interface ModuleManifest {
  name: string;
  specs: ModuleSpecs[];
}

export interface ControllersEntryPoints {
  [key: string]: string;
}

export type ModuleControllers = string | ControllersEntryPoints;

export type Node = ReactFlowNode<FlowsNodeDataTypes, string | undefined>;
export type Nodes = Node[];
