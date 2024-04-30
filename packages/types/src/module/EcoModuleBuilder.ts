import { ModuleSchema } from "./ModuleSchema";

export interface EcoModuleBuilder {
  build(ecoModules: string[]): Promise<ModuleSchema[]>;
  build(ecoModules: string): Promise<ModuleSchema>;
  build(ecoModules: string[], nodePath?: string): Promise<ModuleSchema[]>;
  build(ecoModules: string, nodePath?: string): Promise<ModuleSchema>;
}
