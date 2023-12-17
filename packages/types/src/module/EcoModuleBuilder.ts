import { Module } from "./EcoModule";

export interface EcoModuleBuilder {
  processControllers(controllerPath: string): Function;
  build(): Promise<Module[]>;
  get version(): string;
}
