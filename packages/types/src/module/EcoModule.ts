export interface EcoModule {
  register(): Promise<void>;

  installPackage(packageName: string): Promise<void>;
  removePackage(packageName: string): Promise<void>;
  get listAvailablePackages(): string[];
  get listInstalledPackages(): string[];
}

export interface Module {
  _id: string;
  name: string;
}
