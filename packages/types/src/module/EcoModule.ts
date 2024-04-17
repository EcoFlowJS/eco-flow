import { SearchResults } from "query-registry";
import { EcoModuleBuilder } from "./EcoModuleBuilder";
import { EcoModuleID } from "./Builders/EcoModuleID";
import { ModuleSchema } from "./ModuleSchema";
import { EcoNodeBuilder, ModuleNodes, Node, Nodes } from "./EcoNodeBuilder";

export interface EcoModule {
  registerModules(): Promise<void>;
  isEcoModule(moduleName: string): Promise<boolean>;
  searchModule(moduleName: string): Promise<SearchResults | null>;
  installModule(moduleName: string): Promise<void>;
  removeModule(moduleName: string): Promise<void>;
  installedModules(): Promise<string[]>;
  getModuleSchema(): ModuleSchema[];
  getModuleSchema(moduleID?: string): ModuleSchema;
  getModule(): Module[];
  getModule(moduleID?: string): Module | null;
  getNodes(): Nodes[];
  getNodes(nodeID?: string): Node | null;
  getModuleBuilder(): Promise<EcoModuleBuilder>;
  get getNodeBuilder(): EcoNodeBuilder | null;
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
  | "Range"; // Range or Slider Input Type

export type API_METHODS = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; // Available API Methods;

export interface ModuleSpecsInputsTypeOptions {
  name: string;
  value: string;
}

export interface ModuleSpecsInputs {
  name: string;
  label: string;
  type: ModuleSpecsInputsTypes;
  required?: boolean;
  methods?: API_METHODS[];
  radioValues?: string | string[];
  pickerOptions?: String[] | ModuleSpecsInputsTypeOptions[];
  defaultValue?:
    | string
    | number
    | boolean
    | Date
    | { start: number; end: number };
}

export interface ModuleSpecs {
  name: string;
  type: ModuleTypes;
  describtion?: string;
  inputs?: ModuleSpecsInputs[];
  controller?: string | Function;
}

export interface Module {
  id: EcoModuleID;
  name: string;
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
