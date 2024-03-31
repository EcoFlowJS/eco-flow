import { SearchResults } from "query-registry";
import { EcoModuleBuilder } from "./EcoModuleBuilder";
import { EcoModuleID } from "./Builders/EcoModuleID";
import { ModuleSchema } from "./ModuleSchema";

export interface EcoModule {
  registerModules(): Promise<void>;
  isEcoModule(moduleName: string): Promise<boolean>;
  searchModule(moduleName: string): Promise<SearchResults | null>;
  installModule(moduleName: string): Promise<void>;
  removeModule(moduleName: string): Promise<void>;
  installedModules(): Promise<string[]>;

  getModule(): ModuleSchema[];
  getModule(moduleID?: string): ModuleSchema;

  getNodes(): ModuleNodes[];
  getNodes(nodeID?: string): ModuleNodes | null;

  getModuleBuilder(): Promise<EcoModuleBuilder>;
}

export type ModuleTypes = "Request" | "Middleware" | "Response" | "Debug";

export type ModuleSpecsInputsTypes = "String" | "Options" | "Code";

export interface ModuleSpecsInputsTypeOptions {
  name: string;
  value: string;
}

export interface ModuleSpecsInputs {
  name: string;
  type: ModuleSpecsInputsTypes;
  options?: ModuleSpecsInputsTypeOptions[];
}

export interface ModuleSpecs {
  name: string;
  type: ModuleTypes;
  describtion?: string;
  input?: ModuleSpecsInputs[];
  controller?: string;
}

export interface ModuleNodes extends ModuleSpecs {
  id: EcoModuleID;
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
