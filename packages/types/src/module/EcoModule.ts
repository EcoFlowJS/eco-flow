import { PackageManifest, SearchResults } from "query-registry";
import { EcoModuleBuilder } from "./EcoModuleBuilder.js";
/**
 * Interface for an EcoModuleBuilder that defines multiple build methods to create ModuleSchema objects.
 */
import { EcoModuleID } from "./Builders/EcoModuleID.js";
import { ModuleSchema } from "./ModuleSchema.js";
import {
  EcoNodeBuilder,
  ModuleNodes,
  EcoNode,
  EcoNodes,
} from "./EcoNodeBuilder.js";
import { Node as ReactFlowNode } from "@reactflow/core";
import { FlowsNodeDataTypes } from "../flows/index.js";
import { CSSProperties } from "react";

/**
 * Interface for managing EcoModules in an application.
 */
export interface EcoModule {
  /**
   * Asynchronously registers modules by building the module schema and nodes.
   * @returns A Promise that resolves when the modules are successfully registered.
   */
  registerModules(): Promise<void>;

  /**
   * Checks if a given module is an EcoFlow module by examining its keywords.
   * @param {PackageSearchResult} moduleName - The PackageSearchResult object.
   * @returns {Promise<boolean>} A promise that resolves to true if the module is an EcoFlow module, false otherwise.
   */
  isEcoModule(
    moduleName: SearchResults["objects"][0]["package"]
  ): Promise<boolean>;

  /**
   * Checks if a given module is an EcoFlow module by examining its keywords.
   * @param {string} moduleName - The name of the module.
   * @returns {Promise<boolean>} A promise that resolves to true if the module is an EcoFlow module, false otherwise.
   */
  isEcoModule(moduleName: string): Promise<boolean>;

  /**
   * Searches for a module by name and returns detailed information about the module.
   * @param {string} moduleName - The name of the module to search for.
   * @returns {Promise<ModuleSearchResults>} A promise that resolves to an object containing
   * detailed information about the searched module.
   */
  searchModule(moduleName: string): Promise<ModuleSearchResults>;

  /**
   * Asynchronously installs a module with the specified name and version.
   * @param {string} moduleName - The name of the module to install.
   * @returns {Promise<ModuleSchema>} A promise that resolves to the installed module schema.
   */
  installModule(moduleName: string): Promise<ModuleSchema>;

  /**
   * Asynchronously installs a module dependencies.
   * @returns {Promise<void>}
   */
  installModules(): Promise<void>;

  /**
   * Asynchronously installs a module with the specified name and version.
   * @param {string} moduleName - The name of the module to install.
   * @param {string} [version="latest"] - The version of the module to install.
   * @returns {Promise<ModuleSchema>} A promise that resolves to the installed module schema.
   */
  installModule(moduleName: string, version?: string): Promise<ModuleSchema>;

  /**
   * Installs local modules from the specified module names array.
   * @param {string[]} moduleName - An array of module names to install locally.
   * @returns {Promise<ModuleSchema[]>} A promise that resolves to an array of ModuleSchema objects.
   */
  installLocalModule(moduleName: string[]): Promise<ModuleSchema[]>;

  /**
   * Upgrades or downgrades a module to the specified version.
   * @param {string} moduleName - The name of the module to upgrade/downgrade.
   * @param {string} version - The version to upgrade/downgrade to.
   * @returns {Promise<ModuleSchema>} The module schema of the upgraded/downgraded module.
   */
  upgradeDowngradeModule(
    moduleName: string,
    version: string
  ): Promise<ModuleSchema>;

  /**
   * Asynchronously removes a module by its name.
   * @param {string} moduleName - The name of the module to be removed.
   * @returns {Promise<void>} A promise that resolves once the module is successfully removed.
   */
  removeModule(moduleName: string): Promise<void>;

  /**
   * Asynchronously adds a module or an array of modules to the module schema.
   * If an array of modules is provided, it iterates through each module and adds it.
   * @param {ModuleSchema | ModuleSchema[]} module - The module or array of modules to add.
   * @returns {Promise<void>} A promise that resolves once the module(s) have been added.
   */
  addModule(module: ModuleSchema | ModuleSchema[]): Promise<void>;

  /**
   * Updates a module or an array of modules in the module schema.
   * @param {ModuleSchema | ModuleSchema[]} module - The module or array of modules to update.
   * @returns Promise<void>
   */
  updateModule(module: ModuleSchema | ModuleSchema[]): Promise<void>;

  /**
   * Asynchronously drops a module or an array of modules from the system.
   * @param {EcoModuleID | EcoModuleID[]} moduleID - The ID or array of IDs of the module(s) to drop.
   * @returns {Promise<void>} A promise that resolves once the module(s) have been dropped.
   */
  dropModule(moduleID: EcoModuleID | EcoModuleID[]): Promise<void>;

  /**
   * Retrieves the module schemas.
   * @returns {ModuleSchema[]} The module schema list.
   */
  getModuleSchema(): ModuleSchema[];

  /**
   * Retrieves the module schema based on the provided module ID.
   * @param {EcoModuleID} [moduleID] - The ID of the module to retrieve the schema for.
   * @returns {ModuleSchema} The module schema matching the provided module ID.
   */
  getModuleSchema(moduleID?: EcoModuleID): ModuleSchema;

  /**
   * Retrieves the module schema based on the provided module ID.
   * @param {string} [moduleID] - The ID of the module to retrieve the schema for.
   * @returns {ModuleSchema} The module schema matching the provided module ID.
   */
  getModuleSchema(moduleID?: string): ModuleSchema;

  /**
   * Retrieves a module based on the provided moduleID.
   * If no moduleID is provided, returns an array of all modules.
   * @returns {Module[]} - The module matching the moduleID, or an array of all modules if moduleID is not provided.
   */
  getModule(): Module[];

  /**
   * Retrieves a module based on the provided moduleID.
   * If no moduleID is provided, returns an array of all modules.
   * @param {string} [moduleID] - The ID of the module to retrieve.
   * @returns {Module | null} - The module matching the moduleID, or an array of all modules if moduleID is not provided.
   */
  getModule(moduleID?: string): Module | null;

  /**
   * Retrieves nodes based on the provided node ID and input values.
   * @returns {Promise<EcoNodes>} A promise that resolves to the retrieved node or null.
   */
  getNodes(): Promise<EcoNodes>;

  /**
   * Retrieves nodes based on the provided node ID and input values.
   * @param {string} [nodeID] - The ID of the node to retrieve. If not provided, returns all nodes.
   * @returns {Promise<EcoNode | null>} A promise that resolves to the retrieved node or null.
   */
  getNodes(nodeID?: string): Promise<EcoNode | null>;

  /**
   * Retrieves nodes based on the provided node ID and input values.
   * @param {string} [nodeID] - The ID of the node to retrieve. If not provided, returns all nodes.
   * @param {Object} [inputValuePass={}] - Input values to pass to the nodes.
   * @returns {Promise<EcoNode | null>} A promise that resolves to the retrieved node or null.
   */
  getNodes(
    nodeID?: string,
    inputValuePass?: { [key: string]: any }
  ): Promise<EcoNode | null>;

  /**
   * Retrieves the description of an installed package based on the package name.
   * @param {string} packageName - The name of the package to retrieve the description for.
   * @returns {Promise<InstalledPackagesDescription>} A promise that resolves to an object containing
   * the details of the installed package, such as name, versions, author, download count, and usage status.
   */
  getInstalledPackagesDescription(
    packageName: string
  ): Promise<InstalledPackagesDescription>;

  /**
   * Asynchronously retrieves the total count of available packages that match the specified query.
   * @returns {Promise<Number>} A promise that resolves with the total count of available packages.
   */
  get availablePackagesCounts(): Promise<Number>;

  /**
   * Returns an instance of EcoModuleBuilder using the nodesPath property of the current object.
   * @returns An instance of EcoModuleBuilder
   */
  get moduleBuilder(): EcoModuleBuilder;

  /**
   * Returns an instance of IEcoNodeBuilder if moduleSchema is defined, otherwise returns null.
   * @returns {IEcoNodeBuilder | null} An instance of IEcoNodeBuilder if moduleSchema is defined, otherwise null.
   */
  get getNodeBuilder(): EcoNodeBuilder | null;

  /**
   * Asynchronously retrieves a list of installed modules.
   * @returns {Promise<string[]>} A promise that resolves with an array of installed module names.
   */
  get installedModules(): Promise<string[]>;
}

/**
 * Interface representing the search results for modules.
 * @property {ModuleResults[]} modules - An array of ModuleResults objects.
 * @property {number} total - The total number of modules in the search results.
 */
export interface ModuleSearchResults {
  modules: ModuleResults[];
  total: number;
}

/**
 * Interface representing the results of a module.
 * @interface ModuleResults
 * @property {string} name - The name of the module.
 * @property {Person | string} [author] - The author of the module.
 * @property {string[]} versions - An array of versions of the module.
 * @property {boolean} isInstalled - Indicates if the module is installed.
 * @property {boolean} inUsed - Indicates if the module is in use.
 * @property {string} latestVersion - The latest version of the module.
 * @property {string | null} installedVersions - The installed version(s) of the module.
 * @property {string} [gitRepository] - The git repository of the module
 */
export interface ModuleResults {
  name: string;
  author?: string | SearchResults["objects"][0]["package"]["author"];
  versions: string[];
  isInstalled: boolean;
  inUsed: boolean;
  latestVersion: string;
  installedVersions: string | null;
  gitRepository?: string;
}

/**
 * Defines the possible types of modules: Request, Middleware, Response, Debug.
 */
export type ModuleTypes =
  | "Configuration"
  | "Request"
  | "Middleware"
  | "Response"
  | "Debug"
  | "EventListener"
  | "EventEmitter";

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

/**
 * Defines a type for API methods that can be used in HTTP requests.
 * Possible values are "GET", "POST", "PUT", "DELETE", and "PATCH".
 */
export type API_METHODS = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Represents the type of debug output that can be generated.
 * Possible values are "Message", "Complete", or "Expression".
 */
export type DebugOutput = "Message" | "Complete" | "Expression";

/**
 * Represents the type of debug console to use, which can be either "WebConsole" or "Terminal".
 */
export type DebugConsole = "WebConsole" | "Terminal";

/**
 * Defines a type for a generic response object with string keys and any values.
 */
export type Response = { [key: string]: any };

/**
 * Represents the options for the input type in the ModuleSpecsInputsType interface.
 * @property {string} [label] - The label of the Select picker type.
 * @property {string} [value] - The value of the input type.
 */
export interface ModuleSpecsInputsTypeOptions {
  label: string;
  value: string;
}

/**
 * Interface representing the description of an installed package.
 * @interface InstalledPackagesDescription
 * @property {string} name - The name of the package.
 * @property {string} currentVersion - The current version of the package.
 * @property {string} latestVersion - The latest version available for the package.
 * @property {string | Person} author - The author of the package.
 * @property {number | string} download - The number of downloads or a string representing the download count.
 * @property {boolean} isInUse - Indicates if the package is currently in use.
 * @property {boolean} isLocalPackage - Indicates if the package is a local package.
 */
export interface InstalledPackagesDescription {
  name: string;
  currentVersion: string;
  latestVersion: string;
  author: string | SearchResults["objects"][0]["package"]["author"];
  download: number | string;
  isInUse: boolean;
  isLocalPackage: boolean;
}

/**
 * Interface representing the description of the current package.
 * @property {string} name - The name of the package.
 * @property {string} version - The version of the package.
 * @property {boolean} isInUse - Indicates if the package is currently in use.
 * @property {boolean} isLocalPackage - Indicates if the package is local package.
 */
export interface CurrentPackageDescription {
  name: string;
  version: string;
  isInUse: boolean;
  isLocalPackage: boolean;
}

/**
 * Represents the input specifications for a module.
 * @interface ModuleSpecsInputs
 * @property {string} name - The name of the input.
 * @property {string} label - The label for the input.
 * @property {ModuleSpecsInputsTypes} type - The type of the input.
 * @property {string} hint - The hint for the input type.
 * @property {boolean} [required] - Indicates if the input is required.
 * @property {string} [codeLanguage] - The programming language for the input.
 * @property {API_METHODS[] | ((value?: {[key: string]: any;}) => API_METHODS[] | Promise<API_METHODS[]>)} [methods] - The methods for the input.
 * @property {string | string[] | ((value?: { [key: string]: any; }) => string | string[] | Promise<string | string[]>)} radioValues - The values for radio buttons.
 * @property {string[] | ModuleSpecsInputsTypeOptions[] | ((value?: { [key: string]: any; }) => string[] | ModuleSpecsInputsTypeOptions[] | Promise<string[] | ModuleSpecsInputsTypeOptions[]>)} pickerOptions - The options for a picker field.
 * @property {boolean} listBoxSorting - Indicates if the list box should be sorted.
 * @property {string | number | boolean | Date | string[] | {start: number, end: number} | ((value?: { [key: string]: any;}) => string | number | boolean | Date | string[] | {start: number, end: number})} defaultValue - The default value for the input field.
 */
export interface ModuleSpecsInputs {
  name: string;
  label: string;
  type: ModuleSpecsInputsTypes;
  hint?: string;
  required?: boolean;
  codeLanguage?: string;
  methods?:
    | API_METHODS[]
    | ((value?: {
        [key: string]: any;
      }) => API_METHODS[] | Promise<API_METHODS[]>);
  radioValues?:
    | string
    | string[]
    | ((value?: {
        [key: string]: any;
      }) => string | string[] | Promise<string | string[]>);
  pickerOptions?:
    | string[]
    | ModuleSpecsInputsTypeOptions[]
    | ((value?: {
        [key: string]: any;
      }) =>
        | string[]
        | ModuleSpecsInputsTypeOptions[]
        | Promise<string[] | ModuleSpecsInputsTypeOptions[]>);
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
        | { start: number; end: number }
        | Promise<
            | string
            | number
            | boolean
            | Date
            | string[]
            | { start: number; end: number }
          >);
}

/**
 * Interface for defining the specifications of a module.
 * @interface ModuleSpecs
 * @property {string} name - The name of the module.
 * @property {ModuleTypes} type - The type of the module.
 * @property {string} ["@ecoflow/ecoflow": "^0.0.39"] - The description of the module (optional).
 * @property {string} [controller] - The controller of the module (optional).
 */
export interface ModuleSpecs {
  name: string;
  type: ModuleTypes;
  color?: CSSProperties["backgroundColor"];
  description?: string;
  controller?: string;
}

/**
 * Interface representing the specifications of a manifest, extending ModuleSpecs.
 * @interface ManifestSpecs
 * @extends ModuleSpecs
 * @property {ModuleSpecsInputs[]} [inputs] - An array of input specifications for the manifest.
 */
export interface ManifestSpecs extends ModuleSpecs {
  inputs?: ModuleSpecsInputs[];
}

/**
 * Represents a module in the ecosystem.
 * @interface Module
 * @property {EcoModuleID} id - The ID of the module.
 * @property {string} name - The name of the module.
 * @property {string} packageName - The package name of the module.
 * @property {string} version - The version of the module.
 * @property {ModuleNodes[]} nodes - An array of nodes associated with the module.
 */
export interface Module {
  id: EcoModuleID;
  name: string;
  packageName: string;
  version: string;
  nodes: ModuleNodes[];
}

/**
 * Represents an array of modules.
 */
export type Modules = Module[];

/**
 * Interface representing a module manifest.
 * @interface ModuleManifest
 * @property {string} name - The name of the module.
 * @property {ManifestSpecs[]} specs - An array of ManifestSpecs objects.
 */
export interface ModuleManifest {
  name: string;
  specs: ManifestSpecs[];
}

/**
 * Interface representing a mapping of controller entry points where the key is a string
 * and the value is also a string.
 */
export interface ControllersEntryPoints {
  [key: string]: string;
}

/**
 * Represents the type for ModuleControllers, which can be either a string or a ControllersEntryPoints object.
 */
export type ModuleControllers = string | ControllersEntryPoints;

/**
 * Represents a Node in React Flow with specific data types for node data and optional additional data.
 */
export type Node = ReactFlowNode<FlowsNodeDataTypes, string | undefined>;

/**
 * Represents an array of Node objects.
 */
export type Nodes = Node[];
