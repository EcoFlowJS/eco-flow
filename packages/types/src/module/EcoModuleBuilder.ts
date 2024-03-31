import { ModuleSchema } from "./ModuleSchema";

export interface EcoModuleBuilder {
  build(): Promise<ModuleSchema[]>;
  build(nodesPath: string, ecoModule: string): Promise<ModuleSchema>;
}
