import { EcoModuleID } from "../module/index.js";

export interface ModuleConfigs {
  selectPackage(packageName: string): ModuleConfig | undefined;

  get globalConfig(): Map<string, ModuleConfig>;
}

export interface ModuleConfig {
  get(id: string): EcoModuleConfigurations | null;
  set(id: string, value: EcoModuleConfigurations): void;
  delete(id: string): boolean;
  clear(): void;
  keys(): IterableIterator<string>;

  get allConfigs(): Map<string, EcoModuleConfigurations>;
}

export interface EcoModuleConfigurations {
  nodeID: string;
  moduleID: EcoModuleID;
  label: string;
  configs: any;
}
