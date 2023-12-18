import {
  EcoModuleBuilder as IEcoModuleBuilder,
  Module,
  ModuleManifest,
} from "@eco-flow/types";
import md5 from "md5";
import _ from "lodash";
import path from "path";
import { EcoModuleParser } from "./EcoModuleParser";
import { ModuleEntryPoint } from "../constants/constants";

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

  /**
   * Generates unique identifier for the modules and nodes.
   * To generate a unique identifier for a group leave no need to provide node name.
   * To generate a unique identifier for nodes node name is requied.
   * @param nodeName module name for whose id is to be generated.
   * @returns {string} md5 hashed id string
   */
  private generateModuleID(nodeName?: string): string {
    if (_.isEmpty(nodeName)) return md5(this.manifest.name);
    return md5(`${this.manifest.name}.${nodeName}`);
  }

  /**
   * Generates the Actuall Name for the modules.
   * @param name module name for whose actual name is to be generated
   * @returns {string} Actual name of the module.
   */
  private getActualName(name: string): string {
    return name.startsWith(ModuleEntryPoint)
      ? name.substring(ModuleEntryPoint.length).charAt(0).toUpperCase() +
          name.substring(ModuleEntryPoint.length).slice(1)
      : name.charAt(0).toUpperCase() + name.slice(1);
  }

  /**
   * Starts the module Building process and returns the id and name of the module group.
   * @returns {[string,string]} Returns ID and Name of the module group.
   */
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

  /**
   * Processes the module specs and build the node into module.
   * @returns {Promise<void| string>} Promise is resolved when specs building is done.
   */
  private async _processSpecs(): Promise<void | string> {
    return new Promise<void | string>((resolve, reject) => {
      try {
        const specs = this.manifest.specs;
        this.manifest.specs.forEach((spec) => {
          // TODO: process specs from manifest
          // console.log(spec);
          let controller: Function | undefined;
          if (typeof spec.controller !== "undefined")
            controller = EcoModuleParser.processControllers(
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

  /**
   * Build the module from the module manifest.
   * @returns {Promise<Module[]} Promise of List of modules that have been created.
   */
  async build(): Promise<Module[]> {
    let modules: Module[] = [];
    const [id, name] = this._initBuild();
    await this._processSpecs();

    this.modules.forEach((node) => {
      modules.push(node);
    });
    return modules;
  }

  /**
   * Show the version of the module.
   * @returns {string} Version of the module.
   */
  get version(): string {
    return this.packageJson.version;
  }
}
