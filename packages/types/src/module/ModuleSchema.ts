import { Module } from "./EcoModule";

export interface ModuleSchema {
  get module(): Module | null;
  get name(): string;
  get version(): string;
  get description(): string;
  get author(): string;
  get license(): string;
  getKeyValue(key: string): any;
  getController(id: string): any;
}

export interface PackageJSON {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  ecoModule:
    | string
    | {
        [key: string]: string;
      };
  [key: string]: any;
}
