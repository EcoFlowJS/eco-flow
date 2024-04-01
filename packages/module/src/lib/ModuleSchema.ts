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

export class ModuleSchema implements IModuleSchema {
  private _module: Module | null = null;
  private id: EcoModuleID;
  private nodePath: string;
  private manifest: ModuleManifest;
  private packageJson: PackageJSON;
  private controllers: { [key: string]: any } = {};

  constructor(nodePath: string, moduleName: string) {
    this.nodePath = path.join(nodePath, moduleName);
    this.manifest = require(path.join(nodePath, moduleName, "manifest.json"));
    this.packageJson = require(path.join(nodePath, moduleName, "package.json"));
    this.id = new EcoModule.IDBuilders(this.name);

    this._initControllers();
    this._initProccessor();
  }

  private _initControllers() {
    const { _ } = ecoFlow;
    const controllers = this.packageJson.ecoModule;

    if (_.isArray(controllers))
      throw `[Module: ${this.name}] Array is not supported yet`;

    if (_.isString(controllers)) {
      if (!fse.existsSync(path.join(this.nodePath, controllers)))
        throw `[Module: ${this.name}] Controller File not found at ${path
          .join(this.nodePath, controllers)
          .replace(/\\/g, "/")}`;
      this.controllers["default"] = require(path.join(
        this.nodePath,
        controllers
      ));
    }

    if (_.isObject(controllers)) {
      Object.keys(controllers).map((key) => {
        if (!fse.existsSync(path.join(this.nodePath, controllers[key])))
          throw `[Module: ${
            this.name
          }] Controller File not found of ID ${key} at ${path
            .join(this.nodePath, controllers[key])
            .replace(/\\/g, "/")}`;
        this.controllers[key] = require(path.join(
          this.nodePath,
          controllers[key]
        ));
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
    this._module = {
      id: this.id,
      name: this.name,
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
