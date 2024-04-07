import {
  EcoModuleBuilder as IEcoModuleBuilder,
  ModuleSchema as IModuleSchema,
} from "@ecoflow/types";
import { ModuleSchema } from "./ModuleSchema";

export class EcoModuleBuilder implements IEcoModuleBuilder {
  private nodePath: string;
  private ecoPackages: string[];

  constructor(nodePath: string, ecoPackages: string[]) {
    this.nodePath = nodePath;
    this.ecoPackages = ecoPackages;
  }

  private async initBuild(
    nodePath: string,
    ecoPackages: string
  ): Promise<IModuleSchema> {
    return await new ModuleSchema(nodePath, ecoPackages).initialize();
  }

  async build(
    nodePath?: string,
    ecoModule?: string
  ): Promise<IModuleSchema & IModuleSchema[]> {
    if (nodePath && ecoModule)
      return <IModuleSchema & IModuleSchema[]>(
        await this.initBuild(nodePath ? nodePath : this.nodePath, ecoModule)
      );

    const moduleSchema: IModuleSchema[] = [];
    for await (const ecoModule of this.ecoPackages)
      moduleSchema.push(
        await this.initBuild(nodePath ? nodePath : this.nodePath, ecoModule)
      );

    return <IModuleSchema & IModuleSchema[]>moduleSchema;
  }
}
