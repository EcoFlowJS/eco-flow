import {
  EcoModuleBuilder as IEcoModuleBuilder,
  Module,
  ModuleManifest,
} from "@eco-flow/types";
import path from "path";
import md5 from "md5";
import _ from "lodash";

export class EcoModuleBuilder implements IEcoModuleBuilder {
  private modules: Module[] = [];
  private moduleGroup!: Module["tag"];
  private manifest: ModuleManifest;
  private packageJson: { [key: string]: any };

  constructor(ModulePath: string, moduleName: string) {
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
    };

    return [id, name];
  }

  private async _processSpecs(): Promise<void | string> {
    return new Promise<void | string>((resolve, reject) => {
      try {
        const specs = this.manifest.specs;
        const groupID = this.moduleGroup._id;
        const groupName = this.moduleGroup.name;
        this.manifest.specs.forEach((spec) => {
          // TODO: process specs from manifest
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  // private async _buildChildrens(): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     try {
  //       if (_.isEmpty(this.manifest.children)) {
  //         resolve();
  //         return;
  //       } else {
  //         this.manifest.children.forEach((child) => this.buildChild(child));
  //         resolve();
  //       }
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }

  // private buildChild(child: ModuleChildNode) {
  //   console.log("Child");
  // }

  async build(): Promise<{ [key: string]: Module }[]> {
    let modules: { [key: string]: Module }[] = [];
    const [id, name] = this._initBuild();
    await this._processSpecs();

    this.modules.forEach((node) => {
      let tempNode: { [key: string]: Module } = {};
      tempNode[id] = node;
      modules.push(tempNode);
    });

    return modules;
  }

  get version(): string {
    return this.packageJson.version;
  }
}
