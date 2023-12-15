import { EcoModuleBuilder as IEcoModuleBuilder } from "@eco-flow/types";

export class EcoModuleBuilder implements IEcoModuleBuilder {
  configurationModule(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updateManifest(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  build(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
