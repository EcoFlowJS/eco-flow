import {
  ModuleConfigs as IModuleConfigs,
  ModuleConfig as IModuleConfig,
  EcoModuleConfigurations,
} from "@ecoflow/types";

/**
 * Represents a configuration module that stores configurations for different modules.
 */
class ModuleConfig implements IModuleConfig {
  /**
   * A private property that stores EcoModuleConfigurations objects mapped by string keys.
   */
  private _configs: Map<string, EcoModuleConfigurations>;

  /**
   * Constructor for creating a new instance of a class.
   * Initializes the _configs property as a new Map object.
   */
  constructor() {
    this._configs = new Map();
  }

  /**
   * Clears all configurations stored in the object.
   * @returns void
   */
  clear(): void {
    this._configs.clear();
  }

  /**
   * Retrieves an EcoModuleConfigurations object from the internal map based on the provided id.
   * @param {string} id - The id of the EcoModuleConfigurations object to retrieve.
   * @returns {EcoModuleConfigurations | null} The EcoModuleConfigurations object if found, otherwise null.
   */
  get(id: string): EcoModuleConfigurations | null {
    return this._configs.get(id) || null;
  }

  /**
   * Sets a new EcoModuleConfigurations value for the given id.
   * If the id already exists, the previous value will be replaced.
   * @param {string} id - The identifier for the configuration.
   * @param {EcoModuleConfigurations} value - The configuration value to set.
   * @returns void
   */
  set(id: string, value: EcoModuleConfigurations): void {
    if (this._configs.has(id)) this._configs.delete(id);

    this._configs.set(id, value);
  }

  /**
   * Deletes a configuration with the given ID.
   * @param {string} id - The ID of the configuration to delete.
   * @returns {boolean} - True if the configuration was successfully deleted, false otherwise.
   */
  delete(id: string): boolean {
    return this._configs.delete(id);
  }

  keys(): IterableIterator<string> {
    return this._configs.keys();
  }

  /**
   * Getter method to retrieve all configurations stored in a Map.
   * @returns {Map<string, EcoModuleConfigurations>} - A Map containing all configurations.
   */
  get allConfigs(): Map<string, EcoModuleConfigurations> {
    return this._configs;
  }
}

/**
 * Represents a collection of module configurations.
 */
export class ModuleConfigs implements IModuleConfigs {
  /**
   * A private property that stores module configurations using a Map data structure.
   * The keys are strings representing module names, and the values are ModuleConfig objects.
   */
  private _moduleConfigs: Map<string, ModuleConfig>;

  /**
   * Represents a collection of module configurations.
   * Constructor for creating a new instance of the class.
   */
  constructor() {
    this._moduleConfigs = new Map();
  }

  /**
   * Selects a package by its name and returns its configuration if it exists,
   * otherwise creates a new configuration for the package and returns it.
   * @param {string} packageName - The name of the package to select.
   * @returns The configuration of the selected package or undefined if not found.
   */
  selectPackage(packageName: string): IModuleConfig | undefined {
    if (this._moduleConfigs.has(packageName))
      return this._moduleConfigs.get(packageName);

    return this._moduleConfigs
      .set(packageName, new ModuleConfig())
      .get(packageName);
  }

  /**
   * Getter method to access the global configuration settings stored in a Map.
   * @returns {Map<string, ModuleConfig>} A Map containing module configurations.
   */
  get globalConfig(): Map<string, ModuleConfig> {
    return this._moduleConfigs;
  }
}
