export interface EcoModule {
  register(): Promise<void | string>;

  installPackage(packageName: string): Promise<void>;
  removePackage(packageName: string): Promise<void>;

  getModule(moduleID: string): Promise<Module>;
  getSubmodules(subModuleID: string): Promise<Module[]>;

  get getModules(): Module[];
  get listAvailablePackages(): string[];
  get listInstalledPackages(): string[];
}

export interface Module {
  _id: string;
  name: string;
  tag: {
    _id: string;
    name: string;
  };
  type: ModuleSpecs["type"];
  input?: any[];
  controller?: Function;
}

export interface ModuleManifest {
  name: string;
  specs: ModuleSpecs[];
}

export interface ModuleSpecs {
  name: string;
  type: "Request" | "Middleware" | "Response" | "Debug";
  controllerPath?: string;
  inputs?: ModuleSpecsInputs[];
}

export interface ModuleSpecsInputs {
  name: string;
  type: "Text" | "Options";
}
