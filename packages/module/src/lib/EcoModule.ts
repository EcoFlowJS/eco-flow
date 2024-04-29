import {
  EcoNodeBuilder as IEcoNodeBuilder,
  EcoModule as IEcoModule,
  EcoModuleBuilder as IEcoModuleBuilder,
  Module,
  ModuleNodes,
  ModuleSchema,
  EcoNode,
  EcoNodes,
  InstalledPackagesDescription,
  CurrentPackageDescription,
} from "@ecoflow/types";
import _, { VERSION } from "lodash";
import { homedir } from "node:os";
import path from "path";
import fse from "fs-extra";
import Helper from "@ecoflow/helper";
import {
  PackageJSON,
  PackageManifest,
  SearchResult,
  SearchResults,
  getPackageManifest,
  searchPackages,
} from "query-registry";
import { EcoModuleBuilder } from "./EcoModuleBuilder";
import { EcoModuleID } from "./Builders/EcoModuleID";
import { EcoNodeBuilder } from "./EcoNodeBuilder";

export class EcoModule implements IEcoModule {
  private moduleSchema: ModuleSchema[] = [];
  private nodes: ModuleNodes[] = [];
  private modulePath: string;
  private nodesPath: string;

  constructor() {
    const { moduleDir } = ecoFlow.config._config;

    this.modulePath =
      !_.isUndefined(moduleDir) && !_.isEmpty(moduleDir)
        ? moduleDir
        : path.join(homedir().replace(/\\/g, "/"), ".ecoflow", "modules");

    fse.ensureDirSync(this.modulePath);
    this.nodesPath = path.join(this.modulePath, "node_modules");
  }

  private async getInstalledModules(): Promise<string[]> {
    return (await fse.exists(this.nodesPath))
      ? (
          await fse.readdir(this.nodesPath, {
            withFileTypes: true,
          })
        )
          .filter((dirent) => dirent.isDirectory())
          .filter((dirent) =>
            fse.existsSync(
              path.join(this.nodesPath, dirent.name, "package.json")
            )
          )
          .filter(
            (dirent) =>
              !_.isUndefined(
                require(path.join(this.nodesPath, dirent.name, "package.json"))
                  .ecoModule
              ) &&
              !_.isEmpty(
                require(path.join(this.nodesPath, dirent.name, "package.json"))
                  .ecoModule
              )
          )
          .map((dir) => dir.name)
      : [];
  }

  private async getManifest(
    moduleName: string
  ): Promise<PackageManifest | null> {
    try {
      return await getPackageManifest({ name: moduleName });
    } catch {
      return null;
    }
  }

  private addModule(modules: ModuleSchema) {
    this.moduleSchema = this.moduleSchema.filter(
      (m) => m.module?.id._id !== modules.module?.id._id
    );
    this.moduleSchema.push(modules);
  }

  private dropModule(moduleID: EcoModuleID) {
    this.moduleSchema = this.moduleSchema.filter(
      (m) => m.module?.id._id !== moduleID._id
    );
  }

  private async getCurrentPackageDescription(
    packageName: string
  ): Promise<CurrentPackageDescription | null> {
    if ((await this.installedModules).includes(packageName)) {
      const packageDescription: PackageJSON | null =
        !_.isUndefined(
          require(path.join(this.nodesPath, packageName, "package.json"))
            .ecoModule
        ) &&
        !_.isEmpty(
          require(path.join(this.nodesPath, packageName, "package.json"))
            .ecoModule
        )
          ? require(path.join(this.nodesPath, packageName, "package.json"))
          : null;

      if (packageDescription === null) return null;

      const { name, version } = packageDescription;
      const result: CurrentPackageDescription = {
        name: name !== packageName ? packageName : name,
        version,
        isInUse: false,
        isLocalPackage: !(await this.isEcoModule(
          name !== packageName ? packageName : name
        )),
      };
      const currentModuleNodeIDs =
        (await this.getModule())
          .find((module) => module.packageName === name)
          ?.nodes.map((node) => node.id._id) || [];
      const { flowEditor } = ecoFlow;
      const flowDefinition = await flowEditor.getFlowDefinitions();
      for await (const key of Object.keys(flowDefinition)) {
        let breakLoop = false;
        for await (const node of flowDefinition[key]) {
          if (currentModuleNodeIDs.includes(node.data.moduleID._id)) {
            result.isInUse = true;
            breakLoop = true;
            break;
          }
        }
        if (breakLoop) break;
      }

      return result;
    }

    return null;
  }

  getModuleSchema(moduleID?: string): ModuleSchema & ModuleSchema[] {
    if (_.isUndefined(moduleID))
      return <ModuleSchema & ModuleSchema[]>[...this.moduleSchema];
    const moduleSchema = this.moduleSchema.filter(
      (m) => m.module?.id._id === moduleID
    );
    return <ModuleSchema & ModuleSchema[]>(
      (moduleSchema.length > 0 ? moduleSchema[0] : null)
    );
  }

  getModule(moduleID?: string): (Module | null) & Module[] {
    if (_.isUndefined(moduleID))
      return <(Module | null) & Module[]>this.moduleSchema.map((m) => m.module);

    const module = this.moduleSchema.filter(
      (m) => m.module?.id._id === moduleID
    );
    return <(Module | null) & Module[]>(
      (module.length > 0 ? module[0].module : null)
    );
  }

  getNodes(nodeID?: string): (EcoNode | null) & EcoNodes {
    if (_.isUndefined(nodeID))
      return <(EcoNode | null) & EcoNodes>(<unknown>[...this.nodes]);

    const node = this.nodes.filter((n) => n.id._id === nodeID);

    return <(EcoNode | null) & EcoNodes>(node.length > 0 ? node[0] : null);
  }

  async isEcoModule(moduleName: string): Promise<boolean> {
    const module = await this.getManifest(moduleName);
    if (
      module !== null &&
      !_.isUndefined(module["ecoModule"]) &&
      !_.isEmpty(module["ecoModule"])
    )
      return true;
    return false;
  }

  async getInstalledPackagesDescription(
    packageName: string
  ): Promise<InstalledPackagesDescription> {
    const currentModule = await this.getCurrentPackageDescription(packageName);
    const searchModule = (await this.searchModule(`${packageName}`))!.objects;
    if (currentModule === null) {
      if (searchModule.length > 0) {
        const { name, version, author } = searchModule[0].package;
        return {
          name: packageName,
          currentVersion: "0.0.0",
          latestVersion: name === packageName ? version : "0.0.0",
          author: author && name === packageName ? author : "",
          isInUse: false,
          isLocalPackage: false,
        };
      }
      return {
        name: packageName,
        currentVersion: "0.0.0",
        latestVersion: "0.0.0",
        author: "",
        isInUse: false,
        isLocalPackage: false,
      };
    }

    const {
      name: currentPackageName,
      version: currentVersion,
      isInUse,
      isLocalPackage,
    } = currentModule;

    if (searchModule.length > 0) {
      const { name, version, author } = searchModule[0].package;
      return {
        name: name === currentPackageName ? name : currentPackageName,
        currentVersion: currentVersion,
        latestVersion: name === currentPackageName ? version : "0.0.0",
        author: author && name === currentPackageName ? author : "",
        isInUse,
        isLocalPackage,
      };
    }
    return {
      name: currentPackageName,
      currentVersion: currentVersion,
      latestVersion: "0.0.0",
      author: "",
      isInUse,
      isLocalPackage,
    };
  }

  async searchModule(moduleName: string): Promise<SearchResults | null> {
    try {
      const result = {
        ...(await searchPackages({ query: { text: moduleName } })),
      };
      const newObject: SearchResult[] = [];
      for await (const object of result.objects) {
        if (await this.isEcoModule(object.package.name)) newObject.push(object);
      }
      result.objects = newObject;
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async installModule(moduleName: string): Promise<void> {
    const module = await this.getManifest(moduleName);
    if (
      module !== null &&
      !_.isUndefined(module["ecoModule"]) &&
      !_.isEmpty(module["ecoModule"])
    )
      await Helper.installPackageHelper(this.modulePath, moduleName);
    await this.addModule(
      await (await this.getModuleBuilder()).build(this.nodesPath, moduleName)
    );
  }

  async removeModule(moduleName: string): Promise<void> {
    await Helper.removePackageHelper(this.modulePath, moduleName);
    this.dropModule(new EcoModule.IDBuilders(moduleName));
  }

  async registerModules(): Promise<void> {
    const { log } = ecoFlow;
    try {
      this.moduleSchema = await (await this.getModuleBuilder()).build();
      this.nodes = await (this.getNodeBuilder
        ? this.getNodeBuilder.buildNodes()
        : ([] as ModuleNodes[]));
    } catch (error) {
      log.error(error);
    }
  }

  async getModuleBuilder(): Promise<IEcoModuleBuilder> {
    return new EcoModuleBuilder(this.nodesPath, await this.installedModules);
  }

  get getNodeBuilder(): IEcoNodeBuilder | null {
    return this.moduleSchema ? new EcoNodeBuilder(this.moduleSchema) : null;
  }

  get installedModules(): Promise<string[]> {
    return new Promise<string[]>((resolve) =>
      resolve(this.getInstalledModules())
    );
  }

  static get IDBuilders(): typeof EcoModuleID {
    return EcoModuleID;
  }
}
