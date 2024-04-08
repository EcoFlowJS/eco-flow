import { EcoModuleID } from "./Builders";
import { ModuleSpecs } from "./EcoModule";

export interface EcoNodeBuilder {
  buildNodes(): Promise<ModuleNodes[]>;
}

export interface ModuleNodes extends ModuleSpecs {
  id: EcoModuleID;
}

export interface ExtractedRawNodes {
  requestNodes: ModuleNodes[];
  middlewareNodes: ModuleNodes[];
  responseNodes: ModuleNodes[];
  consoleNodes: ModuleNodes[];
}

export type Node = Readonly<ModuleNodes | null>;
export type Nodes = Readonly<ModuleNodes[]>;
