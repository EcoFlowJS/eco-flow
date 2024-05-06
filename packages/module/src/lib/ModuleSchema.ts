import path from "path";
import {
  EcoModuleID,
  ModuleSchema as IModuleSchema,
  Module,
  ModuleManifest,
  ModuleNodes,
  ModuleSpecs,
  PackageJSON,
} from "@ecoflow/types";
import { EcoModule } from "./EcoModule";
import fse from "fs-extra";
import Helper from "@ecoflow/helper";

/**
 * Represents a module schema that implements the IModuleSchema interface.
 */
export class ModuleSchema implements IModuleSchema {
  private _module: Module | null = null;
  private id: EcoModuleID;
  private nodePath: string;
  private moduleName: string;
  private manifest: (() => ModuleManifest) | ModuleManifest;
  private packageJson: PackageJSON;
  private controllers: { [key: string]: any } = {};

  /**
   * Constructs a new instance of a module with the given node path and module name.
   * @param {string} nodePath - The path to the node module.
   * @param {string} moduleName - The name of the module.
   * @returns None
   */
  constructor(nodePath: string, moduleName: string) {
    this.moduleName = moduleName;
    this.nodePath = path.join(nodePath, moduleName);
    this.manifest = Helper.requireUncached(this.nodePath);
    this.packageJson = Helper.requireUncached(
      path.join(nodePath, moduleName, "package.json")
    );
    if ((<{ default: ModuleManifest }>(<unknown>this.manifest)).default)
      this.manifest = (<{ default: ModuleManifest }>(
        (<unknown>this.manifest)
      )).default;
    this.id = new EcoModule.IDBuilders(this.name);
  }

  /**
   * Initializes the object by setting the manifest, initializing controllers, and processors.
   * @returns {Promise<IModuleSchema>} A promise that resolves to the initialized object.
   */
  async initialize(): Promise<IModuleSchema> {
    this.manifest =
      typeof this.manifest === "function"
        ? await this.manifest()
        : this.manifest;
    this._initControllers();
    this._initProccessor();

    return this;
  }

  /**
   * Initializes controllers based on the configuration provided in the packageJson.
   * Controllers can be defined as a single string, an array, or an object with keys.
   * @private
   * @returns None
   */
  private _initControllers() {
    const { _ } = ecoFlow;
    const controllers = this.packageJson.ecoModule;

    /**
     * If the controllers object is undefined, set a default controller function and return.
     * @param {any} controllers - The controllers object to check for undefined.
     * @returns None
     */
    if (_.isUndefined(controllers)) {
      this.controllers["default"] = function () {};
      return;
    }

    /**
     * Checks if the input is an array and throws an error if it is.
     * @param {any} controllers - The input to check if it is an array.
     * @throws Throws an error if the input is an array.
     */
    if (_.isArray(controllers))
      throw `[Module: ${this.name}] Array is not supported yet`;

    /**
     * Checks if the 'controllers' parameter is a string, then checks if the file exists at the specified path.
     * If the file does not exist, an error is thrown.
     * If the file exists, it is required and stored in the 'controllers' object under the key 'default'.
     * If the required file has a 'default' property, it is reassigned to the 'controllers' object.
     * @param {string} controllers - The path to the controllers file.
     * @returns None
     */
    if (_.isString(controllers)) {
      if (!fse.existsSync(path.join(this.nodePath, controllers)))
        throw `[Module: ${this.name}] Controller File not found at ${path
          .join(this.nodePath, controllers)
          .replace(/\\/g, "/")}`;
      this.controllers["default"] = Helper.requireUncached(
        path.join(this.nodePath, controllers)
      );

      if (this.controllers["default"].default)
        this.controllers["default"] = this.controllers["default"].default;
    }

    /**
     * Loads controller files into the application if they exist.
     * @param {Object} controllers - An object containing controller keys and file paths.
     * @throws Error if a controller file is not found.
     * @returns None
     */
    if (_.isObject(controllers)) {
      Object.keys(controllers).map((key) => {
        if (!fse.existsSync(path.join(this.nodePath, controllers[key])))
          throw `[Module: ${
            this.name
          }] Controller File not found of ID ${key} at ${path
            .join(this.nodePath, controllers[key])
            .replace(/\\/g, "/")}`;
        this.controllers[key] = Helper.requireUncached(
          path.join(this.nodePath, controllers[key])
        );
        if (this.controllers[key].default)
          this.controllers[key] = this.controllers[key].default;
      });
    }
  }

  /**
   * Processes an array of module specifications and returns an array of module nodes.
   * @param {ModuleSpecs[]} specs - An array of module specifications.
   * @returns {ModuleNodes[]} An array of module nodes generated from the specifications.
   */
  private _processNodeSpecs(specs: ModuleSpecs[]) {
    const moduleNodes: ModuleNodes[] = [];
    specs.forEach(({ name, controller, ...specs }) => {
      moduleNodes.push({
        id: new EcoModule.IDBuilders(this.name, name),
        name,
        ...(controller ? { controller: `${this.id._id}.${controller}` } : {}),
        ...specs,
      });
    });

    return moduleNodes;
  }

  /**
   * Initializes the processor by setting up the module object with relevant information.
   * @private
   * @returns None
   */
  private _initProccessor() {
    const { _ } = ecoFlow;
    if (_.isFunction(this.manifest)) return;
    this._module = {
      id: this.id,
      name: this.manifest.name,
      packageName: this.moduleName,
      version: this.version,
      nodes: this._processNodeSpecs(this.manifest.specs),
    };
  }

  /**
   * Getter method to retrieve the module associated with this object.
   * @returns {Module | null} The module associated with this object, or null if not set.
   */
  get module(): Module | null {
    return this._module;
  }

  /**
   * Get the name of the package from the package.json file.
   * @returns The name of the package as a string.
   */
  get name(): string {
    return this.packageJson.name;
  }

  /**
   * Get the version of the package from the package.json file.
   * @returns The version of the package as a string.
   */
  get version(): string {
    return this.packageJson.version;
  }

  /**
   * Get the description of the package from the package.json file.
   * @returns The description of the package as a string.
   */
  get description(): string {
    return this.packageJson.description;
  }

  /**
   * Get the author of the package from the package.json file.
   * @returns The author of the package as a string.
   */
  get author(): string {
    return this.packageJson.author;
  }

  /**
   * Get the license information from the package.json file.
   * @returns {string} The license information.
   */
  get license(): string {
    return this.packageJson.license;
  }

  /**
   * Get the value of a specific key from the packageJson object.
   * @param {string} key - The key to retrieve the value for.
   * @returns The value corresponding to the provided key from the packageJson object.
   */
  getKeyValue(key: string) {
    return this.packageJson[key];
  }

  /**
   * Retrieves a controller object based on the provided ID.
   * @param {string} id - The ID of the controller to retrieve.
   * @returns The controller object associated with the provided ID.
   */
  getController(id: string) {
    return this.controllers[id];
  }
}
