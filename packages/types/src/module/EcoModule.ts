import type { SearchResults } from "query-registry";
export interface EcoModule {
  /**
   * Register all the modules in the ModuleRegistry.
   * @returns {Promise<void | string>} Promise resolved when all the modules have been registered.
   */
  register(): Promise<void | string>;

  /**
   * Install the module from the PackageRegistry.
   * @param moduleName Module name that to be install.
   * @returns { Promise<void> } Promise resolved when module is installed.
   */
  installModule(moduleName: string): Promise<void>;

  /**
   * Search the PackageRegistry for the specified module.
   * @param moduleName Module name to be search in the PackageRegistry.
   * @returns { Promise<SearchResults> } Promise resolve the search results.
   */
  searchModule(moduleName: string): Promise<SearchResults>;

  /**
   * Uninstall the specified module from the PackageRegistry.
   * @param moduleName Module name that to be uninstalled.
   * @returns {Promise<void>} Promise resolve when the module is uninstalled.
   */
  removeModule(moduleName: string): Promise<void>;

  /**
   * Get a specific module frrom the ModuleRegistry.
   * @param moduleID ID of the module to be fetch.
   * @returns {Promise<Module>} Promise of module
   */
  getModule(moduleID: string): Promise<Module | undefined>;

  /**
   * list all packages in the module registry.
   * @returns {Promise<string[]>} Promise of modules registered in the ModuleRegistry.
   */
  get getModules(): Module[];

  /**
   * list all modules in the module registry.
   * @returns {Promise<SearchResults>} Promise of search results for all available modules in the PackageRegistry.
   */
  get listAvailablePackages(): Promise<SearchResults>;

  /**
   * list all packages installed.
   * @returns {Promise<string[]>} Promise of modules Installed.
   */
  get listInstalledPackages(): Promise<string[]>;
}

export interface Module {
  _id: string;
  name: string;
  tag: {
    _id: string;
    name: string;
    version: string;
  };
  type: ModuleSpecs["type"];
  describtion?: string;
  input?: ModuleSpecsInputs[];
  controller?: Function;
}

export interface ModuleManifest {
  name: string;
  specs: ModuleSpecs[];
}

export interface ModuleSpecs {
  name: string;
  type: "Request" | "Middleware" | "Response" | "Debug";
  describtion?: string;
  controller?: string;
  inputs?: ModuleSpecsInputs[];
}

export interface ModuleSpecsInputs {
  name: string;
  type: "Text" | "Options";
  options?: Array<ModuleSpecsInputsOptions> | string;
}

export interface ModuleSpecsInputsOptions {
  name: string;
  value: string;
}
