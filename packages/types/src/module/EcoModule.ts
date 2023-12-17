export interface EcoModule {
  register(): Promise<void | string>;

  installPackage(packageName: string): Promise<void>;
  removePackage(packageName: string): Promise<void>;

  getModule(moduleID: string): Promise<Module>;

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
    version: string;
  };
  type: ModuleSpecs["type"];
  describtion?: string;
  input?: ModuleSpecsInputs[];
  controller?: Function;
}

export interface ModuleManifest {
  name: string;
  specs: ModuleSpecs[];
}

export interface ModuleSpecs {
  name: string;
  type: "Request" | "Middleware" | "Response" | "Debug";
  describtion?: string;
  controller?: string;
  inputs?: ModuleSpecsInputs[];
}

export interface ModuleSpecsInputs {
  name: string;
  type: "Text" | "Options";
  options?: Array<ModuleSpecsInputsOptions> | string;
  [key: string]: any;
}

export interface ModuleSpecsInputsOptions {
  name: string;
  value: string;
}
