import {
  EcoModuleBuilder as IEcoModuleBuilder,
  ModuleSchema as IModuleSchema,
} from "@ecoflow/types";
import { ModuleSchema } from "./ModuleSchema";

export class EcoModuleBuilder implements IEcoModuleBuilder {
  private nodePath: string;

  constructor(nodePath: string) {
    this.nodePath = nodePath;
  }

  private async initBuild(
    nodePath: string,
    ecoPackages: string
  ): Promise<IModuleSchema> {
    return await new ModuleSchema(nodePath, ecoPackages).initialize();
  }

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
