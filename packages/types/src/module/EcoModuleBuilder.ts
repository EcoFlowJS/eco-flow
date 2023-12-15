export interface EcoModuleBuilder {
  configurationModule(): Promise<void>;
  updateManifest(): Promise<void>;
  build(): Promise<void>;
}
