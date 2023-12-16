import { Module } from "./EcoModule";

export interface EcoModuleBuilder {
  build(): Promise<{ [key: string]: Module }[]>;

  get version(): string;
}
