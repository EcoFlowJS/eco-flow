import { ModuleSchema } from "./ModuleSchema.js";

/**
 * Interface for an EcoModuleBuilder that defines multiple build methods to create ModuleSchema objects.
 */
export interface EcoModuleBuilder {
  /**
   * Builds the module schema for the given ecoModules.
   * @param {string[]} ecoModules - The ecoModules to build the schema for.
   * @returns A promise that resolves to an array of ModuleSchema.
   */
  build(ecoModules: string[]): Promise<ModuleSchema[]>;

  /**
   * Builds the module schema for the given ecoModules.
   * @param {string} ecoModules - The ecoModules to build the schema for.
   * @param {string} [nodePath] - The path of the node.
   * @returns A promise that resolves ModuleSchema.
   */
  build(ecoModules: string): Promise<ModuleSchema>;

  /**
   * Builds the module schema for the given ecoModules.
   * @param {string[]} ecoModules - The ecoModules to build the schema for.
   * @param {string} [nodePath] - The path of the node.
   * @returns A promise that resolves to an array of ModuleSchema.
   */
  build(ecoModules: string[], nodePath?: string): Promise<ModuleSchema[]>;

  /**
   * Builds the module schema for the given ecoModules.
   * @param {string} ecoModules - The ecoModules to build the schema for.
   * @param {string} [nodePath] - The path of the node.
   * @returns A promise that resolves ModuleSchema.
   */
  build(ecoModules: string, nodePath?: string): Promise<ModuleSchema>;
}
