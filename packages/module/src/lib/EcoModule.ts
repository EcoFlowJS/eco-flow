import { EcoModule as IEcoModule, Module } from "@ecoflow/types";
import { EcoModuleBuilder } from "./EcoModuleBuilder";
import _ from "lodash";
import { homedir } from "node:os";
import path from "path";
import fse, { promises } from "fs-extra";
import { SearchResults, searchPackages } from "query-registry";
import { Helper } from "@ecoflow/helper";
import { ModuleEntryPoint } from "../constants/constants";

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

  /**
   * Register the module with the ModuleRegistry.
   * @param ecoPackages Module names to register with the module registry.
   * @returns {Promise<void>} Promise resolved when the module is registered.
   */
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

  /**
   * Shows the list of the package registered to the ModuleRegistry.
   * @returns { Promise<string[]>} The list of package names registered.
   */
  private async listEcoPackages(): Promise<string[]> {
    const modules = (await fse.exists(this.moduleActualPath))
      ? (
          await fse.readdir(this.moduleActualPath, {
            withFileTypes: true,
          })
        )
          .filter(
            (dirent) =>
              dirent.isDirectory() && dirent.name.startsWith(ModuleEntryPoint)
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

  /**
   * Generates the complete module name with the required prefix.
   * @param moduleName name of the module with or without the required prefix.
   * @returns {string} complete module name with prefix.
   */
  private getActualModuleName(moduleName: string): string {
    return !_.isEmpty(moduleName)
      ? moduleName.length > ModuleEntryPoint.length
        ? moduleName.startsWith(ModuleEntryPoint)
          ? moduleName
          : ModuleEntryPoint + moduleName
        : ModuleEntryPoint.substring(0, moduleName!.length) === moduleName
        ? moduleName
        : ModuleEntryPoint + moduleName
      : ModuleEntryPoint;
  }

  /**
   * Register all the modules in the ModuleRegistry.
   * @returns {Promise<void | string>} Promise resolved when all the modules have been registered.
   */
  async register(): Promise<void | string> {
    this.modules = [];
    return new Promise<void | string>(async (resolve, reject) => {
      try {
        const ecoPackages = await this.listInstalledPackages;
        await this.registerModules(ecoPackages);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Install the module from the PackageRegistry.
   * @param moduleName Module name that to be install.
   * @returns { Promise<void> } Promise resolved when module is installed.
   */
  async installModule(moduleName: string): Promise<void> {
    await Helper.installPackageHelper(
      this.modulePath,
      this.getActualModuleName(moduleName)
    );
  }

  /**
   * Search the PackageRegistry for the specified module.
   * @param moduleName Module name to be search in the PackageRegistry.
   * @returns { Promise<SearchResults> } Promise resolve the search results.
   */
  async searchModule(moduleName?: string): Promise<SearchResults> {
    return new Promise<SearchResults>((resolve, reject) => {
      searchPackages({ query: { text: this.getActualModuleName(moduleName!) } })
        .then((results) => resolve(results))
        .catch((error) => reject(error));
    });
  }

  /**
   * Uninstall the specified module from the PackageRegistry.
   * @param moduleName Module name that to be uninstalled.
   * @returns {Promise<void>} Promise resolve when the module is uninstalled.
   */
  async removeModule(moduleName: string): Promise<void> {
    await Helper.removePackageHelper(
      this.modulePath,
      this.getActualModuleName(moduleName)
    );
  }

  /**
   * Get a specific module frrom the ModuleRegistry.
   * @param moduleID ID of the module to be fetch.
   * @returns {Promise<Module>} Promise of module
   */
  async getModule(moduleID: string): Promise<Module | undefined> {
    return new Promise<Module | undefined>((resolve, reject) => {
      const module = this.modules.filter((m) => m._id === moduleID);
      if (module.length > 0) resolve(module[0]);
      else resolve(undefined);
    });
  }

  /**
   * list all modules in the package registry.
   * @returns {Promise<SearchResults>} Promise of search results for all available modules in the PackageRegistry.
   */
  get listAvailablePackages(): Promise<SearchResults> {
    return new Promise<SearchResults>((resolve, reject) => {
      searchPackages({
        query: {
          text: ModuleEntryPoint,
        },
      })
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  /**
   * list all packages installed.
   * @returns {Promise<string[]>} Promise of modules Installed.
   */
  get listInstalledPackages(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.listEcoPackages()
        .then((list) => resolve(list))
        .catch((err) => reject(err));
    });
  }

  /**
   * list all packages in the module registry.
   * @returns {Promise<string[]>} Promise of modules registered in the ModuleRegistry.
   */
  get getModules(): Module[] {
    let modules: Module[] = [];
    this.modules.forEach((module) => {
      modules.push(module);
    });

    return modules;
  }
}
