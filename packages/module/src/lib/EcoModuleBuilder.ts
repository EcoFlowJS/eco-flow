import {
  EcoModuleBuilder as IEcoModuleBuilder,
  Module,
  ModuleManifest,
} from "@eco-flow/types";
import path from "path";
import md5 from "md5";
import _ from "lodash";
import fse from "fs-extra";

export class EcoModuleBuilder implements IEcoModuleBuilder {
  private modules: Module[] = [];
  private moduleGroup!: Module["tag"];
  private modulePath: string;
  private manifest: ModuleManifest;
  private packageJson: { [key: string]: any };

  constructor(ModulePath: string, moduleName: string) {
    this.modulePath = path.join(ModulePath, moduleName);
    this.manifest = require(path.join(ModulePath, moduleName, "manifest.json"));
    this.packageJson = require(path.join(
      ModulePath,
      moduleName,
      "package.json"
    ));
  }

  private generateModuleID(moduleName?: string): string {
    if (_.isEmpty(moduleName)) return md5(this.manifest.name);
    return md5(`${this.manifest.name}.${moduleName}`);
  }

  private getActualName(name: string): string {
    return name.startsWith("ecoflow_module_")
      ? name.substring("ecoflow_module_".length).charAt(0).toUpperCase() +
          name.substring("ecoflow_module_".length).slice(1)
      : name.charAt(0).toUpperCase() + name.slice(1);
  }

  private _initBuild(): [string, string] {
    const id = this.generateModuleID();
    const name = this.getActualName(this.manifest.name);
    this.moduleGroup = {
      _id: id,
      name: name,
      version: this.version,
    };

    return [id, name];
  }

  private async _processSpecs(): Promise<void | string> {
    return new Promise<void | string>((resolve, reject) => {
      try {
        const specs = this.manifest.specs;
        this.manifest.specs.forEach((spec) => {
          // TODO: process specs from manifest
          // console.log(spec);
          let controller: Function | undefined;
          if (typeof spec.controller !== "undefined")
            controller = this.processControllers(
              path.join(this.modulePath, spec.controller)
            );

          const moduleSpecs: Module = {
            _id: this.generateModuleID(spec.name),
            name: spec.name,
            type: spec.type,
            tag: this.moduleGroup,
          };
          if (!_.isUndefined(spec.describtion))
            moduleSpecs.describtion = spec.describtion;
          if (!_.isUndefined(spec.controller))
            moduleSpecs.controller = controller;
          if (!_.isUndefined(spec.inputs)) moduleSpecs.input = spec.inputs;

          this.modules.push(moduleSpecs);
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  async build(): Promise<Module[]> {
    let modules: Module[] = [];
    const [id, name] = this._initBuild();
    await this._processSpecs();

    this.modules.forEach((node) => {
      modules.push(node);
    });
    return modules;
  }

  processControllers(controllerPath: string): Function {
    let controller: Function = (ctx: any) => ctx;
    if (!fse.existsSync(controllerPath)) return controller;
    try {
      const tempController = require(controllerPath);
      if (!_.isFunction(tempController)) return controller;
      return tempController;
    } catch {
      return controller;
    }
  }

  get version(): string {
    return this.packageJson.version;
  }
}
