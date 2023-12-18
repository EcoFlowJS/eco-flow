import { Module } from "./EcoModule";

export interface EcoModuleBuilder {
  /**
   * Build the module from the module manifest.
   * @returns {Promise<Module[]} Promise of List of modules that have been created.
   */
  build(): Promise<Module[]>;

  /**
   * Show the version of the module.
   * @returns {string} Version of the module.
   */
  get version(): string;
}
