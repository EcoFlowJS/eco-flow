import {
  EcoModuleBuilder as IEcoModuleBuilder,
  ModuleSchema as IModuleSchema,
} from "@ecoflow/types";
import { ModuleSchema } from "./ModuleSchema";

/**
 * A class that implements the IEcoModuleBuilder interface to build Eco modules.
 */
export class EcoModuleBuilder implements IEcoModuleBuilder {
  private nodePath: string;

  /**
   * Constructor for creating a new instance of a class.
   * @param {string} nodePath - The path of the node.
   * @returns None
   */
  constructor(nodePath: string) {
    this.nodePath = nodePath;
  }

  /**
   * Initializes the build process for a module with the given node path and eco packages.
   * @param {string} nodePath - The path to the node module.
   * @param {string} ecoPackages - The eco packages to be used in the build process.
   * @returns {Promise<IModuleSchema>} A promise that resolves to the initialized module schema.
   */
  private async initBuild(
    nodePath: string,
    ecoPackages: string
  ): Promise<IModuleSchema> {
    return await new ModuleSchema(nodePath, ecoPackages).initialize();
  }

  /**
   * Builds the module schema for the given ecoModules.
   * @param {string | string[]} ecoModules - The ecoModules to build the schema for.
   * @param {string} [nodePath] - The path of the node.
   * @returns A promise that resolves to an array of IModuleSchema & IModuleSchema[].
   */
  async build(
    ecoModules: string | string[],
    nodePath?: string
  ): Promise<IModuleSchema & IModuleSchema[]> {
    if (Array.isArray(ecoModules)) {
      const moduleSchema: IModuleSchema[] = [];
      for await (const ecoModule of ecoModules)
        moduleSchema.push(
          await this.initBuild(nodePath ? nodePath : this.nodePath, ecoModule)
        );

      return <IModuleSchema & IModuleSchema[]>moduleSchema;
    }

    return <IModuleSchema & IModuleSchema[]>(
      await this.initBuild(nodePath ? nodePath : this.nodePath, ecoModules)
    );
  }
}
