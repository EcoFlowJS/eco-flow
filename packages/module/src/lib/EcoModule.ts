import { EcoModule as IEcoModule, Module } from "@eco-flow/types";
import { EcoModuleBuilder } from "./EcoModuleBuilder";
import _ from "lodash";
import { homedir } from "node:os";
import path from "path";
import fse from "fs-extra";

export class EcoModule implements IEcoModule {
  private modules: Module[] = [];
  private modulePath: string;
  private moduleActualPath: string;

  constructor() {
    this.modulePath = !_.isEmpty(ecoFlow.config._config.moduleDir)
      ? ecoFlow.config._config.moduleDir!
      : path.join(homedir().replace(/\\/g, "/"), ".ecoflow", "nodes");

    fse.ensureDirSync(this.modulePath);
    this.moduleActualPath = path.join(this.modulePath, "node_modules");
  }

  private async registerModules(ecoPackages: string[]): Promise<void | string> {
    return new Promise<void | string>((resolve, reject) => {
      try {
        ecoPackages.forEach(async (moduleName) => {
          const ecoModuleBuilder = new EcoModuleBuilder(
            this.moduleActualPath,
            moduleName
          );
          this.modules = await ecoModuleBuilder.build();
          // console.log(this.modules);
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  private async listEcoPackages(): Promise<string[]> {
    const modules = (await fse.exists(this.moduleActualPath))
      ? (
          await fse.readdir(this.moduleActualPath, {
            withFileTypes: true,
          })
        )
          .filter(
            (dirent) =>
              dirent.isDirectory() && dirent.name.startsWith("ecoflow_module_")
          )
          .filter((dirent) => {
            if (
              fse.existsSync(
                path.join(this.moduleActualPath, dirent.name, "package.json")
              ) &&
              fse.existsSync(
                path.join(this.moduleActualPath, dirent.name, "manifest.json")
              )
            )
              return true;
          })
          .map((dir) => dir.name)
      : [];

    return modules;
  }

  async register(): Promise<void | string> {
    return new Promise<void | string>(async (resolve, reject) => {
      try {
        const ecoPackages = await this.listEcoPackages();
        await this.registerModules(ecoPackages);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async installPackage(packageName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async removePackage(packageName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getModule(moduleID: string): Promise<Module> {
    return new Promise<Module>((resolve, reject) => {
      resolve(this.modules.filter((m) => m._id === moduleID)[0]);
    });
  }

  get listAvailablePackages(): string[] {
    throw new Error("Method not implemented.");
  }

  get listInstalledPackages(): string[] {
    throw new Error("Method not implemented.");
  }

  get getModules(): Module[] {
    let modules: Module[] = [];
    this.modules.forEach((module) => {
      modules.push(module);
    });

    return modules;
  }
}
