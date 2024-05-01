import path from "path";
import {
  EcoModuleID,
  ModuleSchema as IModuleSchema,
  Module,
  ModuleManifest,
  ModuleNodes,
  ModuleSpecs,
  PackageJSON,
} from "@ecoflow/types";
import { EcoModule } from "./EcoModule";
import fse from "fs-extra";
import Helper from "@ecoflow/helper";

export class ModuleSchema implements IModuleSchema {
  private _module: Module | null = null;
  private id: EcoModuleID;
  private nodePath: string;
  private moduleName: string;
  private manifest: (() => ModuleManifest) | ModuleManifest;
  private packageJson: PackageJSON;
  private controllers: { [key: string]: any } = {};

  constructor(nodePath: string, moduleName: string) {
    this.moduleName = moduleName;
    this.nodePath = path.join(nodePath, moduleName);
    this.manifest = Helper.requireUncached(this.nodePath);
    this.packageJson = Helper.requireUncached(
      path.join(nodePath, moduleName, "package.json")
    );
    this.id = new EcoModule.IDBuilders(this.name);
  }

  async initialize(): Promise<this> {
    this.manifest =
      typeof this.manifest === "function"
        ? await this.manifest()
        : this.manifest;
    this._initControllers();
    this._initProccessor();

    return this;
  }

  private _initControllers() {
    const { _ } = ecoFlow;
    const controllers = this.packageJson.ecoModule;

    if (_.isUndefined(controllers)) {
      this.controllers["default"] = function () {};
      return;
    }

    if (_.isArray(controllers))
      throw `[Module: ${this.name}] Array is not supported yet`;

    if (_.isString(controllers)) {
      if (!fse.existsSync(path.join(this.nodePath, controllers)))
        throw `[Module: ${this.name}] Controller File not found at ${path
          .join(this.nodePath, controllers)
          .replace(/\\/g, "/")}`;
      this.controllers["default"] = Helper.requireUncached(
        path.join(this.nodePath, controllers)
      );
    }

    if (_.isObject(controllers)) {
      Object.keys(controllers).map((key) => {
        if (!fse.existsSync(path.join(this.nodePath, controllers[key])))
          throw `[Module: ${
            this.name
          }] Controller File not found of ID ${key} at ${path
            .join(this.nodePath, controllers[key])
            .replace(/\\/g, "/")}`;
        this.controllers[key] = Helper.requireUncached(
          path.join(this.nodePath, controllers[key])
        );
      });
    }
  }

  private _processNodeSpecs(specs: ModuleSpecs[]) {
    const moduleNodes: ModuleNodes[] = [];
    specs.forEach(({ name, controller, ...specs }) => {
      moduleNodes.push({
        id: new EcoModule.IDBuilders(this.name, name),
        name,
        ...(controller ? { controller: `${this.id._id}.${controller}` } : {}),
        ...specs,
      });
    });

    return moduleNodes;
  }

  private _initProccessor() {
    const { _ } = ecoFlow;
    if (_.isFunction(this.manifest)) return;
    this._module = {
      id: this.id,
      name: this.manifest.name,
      packageName: this.moduleName,
      version: this.version,
      nodes: this._processNodeSpecs(this.manifest.specs),
    };
  }

  get module(): Module | null {
    return this._module;
  }

  get name(): string {
    return this.packageJson.name;
  }

  get version(): string {
    return this.packageJson.version;
  }

  get description(): string {
    return this.packageJson.description;
  }

  get author(): string {
    return this.packageJson.author;
  }

  get license(): string {
    return this.packageJson.license;
  }

  getKeyValue(key: string) {
    return this.packageJson[key];
  }

  getController(id: string) {
    return this.controllers[id];
  }
}
