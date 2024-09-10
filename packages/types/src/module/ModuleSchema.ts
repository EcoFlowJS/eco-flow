import { Module } from "./EcoModule.js";

export interface ModuleSchema {
  /**
   * Initializes the object by setting the manifest, initializing controllers, and processors.
   * @returns {Promise<IModuleSchema>} A promise that resolves to the initialized object.
   */
  initialize(): Promise<ModuleSchema>;

  /**
   * Getter method to retrieve the module associated with this object.
   * @returns {Module | null} The module associated with this object, or null if not set.
   */
  get module(): Module | null;

  /**
   * Get the name of the package from the package.json file.
   * @returns The name of the package as a string.
   */
  get name(): string;

  /**
   * Get the version of the package from the package.json file.
   * @returns The version of the package as a string.
   */
  get version(): string;

  /**
   * Get the description of the package from the package.json file.
   * @returns The description of the package as a string.
   */
  get description(): string;

  /**
   * Get the author of the package from the package.json file.
   * @returns The author of the package as a string.
   */
  get author(): string;

  /**
   * Get the license information from the package.json file.
   * @returns {string} The license information.
   */
  get license(): string;

  /**
   * Get the value of a specific key from the packageJson object.
   * @param {string} key - The key to retrieve the value for.
   * @returns The value corresponding to the provided key from the packageJson object.
   */
  getKeyValue(key: string): any;

  /**
   * Retrieves a controller object based on the provided ID.
   * @param {string} id - The ID of the controller to retrieve.
   * @returns The controller object associated with the provided ID.
   */
  getController(id: string): any;
}

/**
 * Represents the structure of a package.json file.
 * @interface PackageJSON
 * @property {string} name - The name of the package.
 * @property {string} version - The version of the package.
 * @property {string} description - A brief description of the package.
 * @property {string} author - The author of the package.
 * @property {string} license - The license under which the package is distributed.
 * @property {string | { [key: string]: string }} [ecoModule] - An optional field that can be a string or an object with key-value pairs.
 * @property {any} [key: string] - Additional properties that can be added to the package.json.
 */
export interface PackageJSON {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  ecoModule?:
    | string
    | {
        [key: string]: string;
      };
  [key: string]: any;
}
