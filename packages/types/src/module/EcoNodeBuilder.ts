import { FlowInputSpecs } from "../flows";
import { EcoModuleID } from "./Builders";
import { ModuleSpecs } from "./EcoModule";

export interface EcoNodeBuilder {
  buildNodes(): Promise<ModuleNodes[]>;
}

export interface ModuleNodes extends ModuleSpecs {
  id: EcoModuleID;
  inputs?: FlowInputSpecs[];
}

export interface ExtractedRawNodes {
  requestNodes: ModuleNodes[];
  middlewareNodes: ModuleNodes[];
  responseNodes: ModuleNodes[];
  consoleNodes: ModuleNodes[];
}

export type EcoNode = Readonly<ModuleNodes | null>;
export type EcoNodes = Readonly<ModuleNodes[]>;
