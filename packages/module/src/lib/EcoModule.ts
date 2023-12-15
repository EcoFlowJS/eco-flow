import { EcoModule as IEcoModule, Module } from "@eco-flow/types";
import { EcoModuleBuilder } from "./EcoModuleBuilder";

export class EcoModule implements IEcoModule {
  private modules: Module[] = [];
  private modulePath!: string;
  private moduleBuilder: EcoModuleBuilder = new EcoModuleBuilder();

  constructor() {}

  private registerModules(name: string): void {}

  async register(): Promise<void> {}

  async installPackage(packageName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async removePackage(packageName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  get listAvailablePackages(): string[] {
    throw new Error("Method not implemented.");
  }
  get listInstalledPackages(): string[] {
    throw new Error("Method not implemented.");
  }
}
