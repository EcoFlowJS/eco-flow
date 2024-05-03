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
  ModuleSearchResults,
  ModuleResults,
} from "@ecoflow/types";
import { homedir } from "node:os";
import path from "path";
import fse from "fs-extra";
import Helper from "@ecoflow/helper";
import {
  PackageJSON,
  PackageManifest,
  SearchResult,
  SearchResults,
  getPackageDownloads,
  getPackageManifest,
  searchPackages,
  getPackument,
  Packument,
  PackageSearchResult,
} from "query-registry";
import { EcoModuleBuilder } from "./EcoModuleBuilder";
import { EcoModuleID } from "./Builders/EcoModuleID";
import { EcoNodeBuilder } from "./EcoNodeBuilder";
import TPromise from "thread-promises";
import StreamZip from "node-stream-zip";

export class EcoModule implements IEcoModule {
  private moduleSchema: ModuleSchema[] = [];
  private nodes: ModuleNodes[] = [];
  private modulePath: string;
  private nodesPath: string;
  private localModulePaths: string;

  constructor() {
    const { _, config } = ecoFlow;
    const { moduleDir } = config._config;

    this.modulePath =
      !_.isUndefined(moduleDir) && !_.isEmpty(moduleDir)
        ? moduleDir
        : path.join(homedir().replace(/\\/g, "/"), ".ecoflow", "modules");

    fse.ensureDirSync(this.modulePath);
    this.localModulePaths = path.join(this.modulePath, "local");
    this.nodesPath = path.join(this.modulePath, "node_modules");
  }

  private async getInstalledModules(): Promise<string[]> {
    const { _ } = ecoFlow;
    return (await fse.exists(this.nodesPath))
      ? (
          await fse.readdir(this.nodesPath, {
            withFileTypes: true,
          })
        )
          .filter((dirent) => dirent.isDirectory() || dirent.isSymbolicLink())
          .filter((dirent) =>
            fse.existsSync(
              path.join(this.nodesPath, dirent.name, "package.json")
            )
          )
          .filter((dirent) => {
            const ecoPackage: any = Helper.requireUncached(
              path.join(this.nodesPath, dirent.name, "package.json")
            );

            if (
              !_.isUndefined(ecoPackage.keywords) &&
              !_.isEmpty(ecoPackage.keywords) &&
              ecoPackage.keywords.includes("EcoFlow") &&
              ecoPackage.keywords.includes("EcoFlowModule")
            )
              return true;

            return false;
          })
          .map((dir) => dir.name)
      : [];
  }

  private async getManifest(
    moduleName: string
  ): Promise<PackageManifest | null> {
    try {
      return await getPackageManifest({ name: moduleName, cached: true });
    } catch {
      return null;
    }
  }

  private async getPackument(packageName: string): Promise<Packument> {
    return await getPackument({
      name: packageName,
      cached: true,
    });
  }

  private async getDownloadCount(moduleName: string): Promise<string | number> {
    try {
      return (
        await getPackageDownloads({
          name: moduleName,
          cached: true,
        })
      ).downloads;
    } catch {
      return "N/A";
    }
  }

  private async searchPackages(moduleName: string): Promise<SearchResults> {
    const result = {
      ...(await searchPackages({
        query: {
          text: `${moduleName} keywords:EcoFlow EcoFlowModule`,
        },
        cached: true,
      })),
    };

    const newObject: SearchResult[] = [];
    for await (const object of result.objects) {
      if (await this.isEcoModule(object.package)) newObject.push(object);
    }

    result.objects = newObject;
    result.total = newObject.length;
    return result;
  }

  async addModule(module: ModuleSchema | ModuleSchema[]): Promise<void> {
    if (Array.isArray(module)) {
      for await (const m of module) await this.addModule(m);
      return;
    }

    this.moduleSchema = this.moduleSchema.filter(
      (m) => m.module?.id._id !== module.module?.id._id
    );
    this.moduleSchema.push(module);
    this.nodes = await (this.getNodeBuilder
      ? this.getNodeBuilder.buildNodes()
      : ([] as ModuleNodes[]));
  }

  async updateModule(module: ModuleSchema | ModuleSchema[]): Promise<void> {
    if (Array.isArray(module)) {
      for await (const m of module) await this.updateModule(m);
      return;
    }

    this.moduleSchema.map((schema, index, schemas) => {
      if (schema.module?.id._id === module.module?.id._id)
        schemas.splice(index, 1, module);
    });

    this.nodes = await (this.getNodeBuilder
      ? this.getNodeBuilder.buildNodes()
      : ([] as ModuleNodes[]));
  }

  async dropModule(moduleID: EcoModuleID | EcoModuleID[]): Promise<void> {
    if (Array.isArray(moduleID)) {
      for await (const m of moduleID) await this.dropModule(m);
      return;
    }

    this.moduleSchema = this.moduleSchema.filter(
      (m) => m.module?.id._id !== moduleID._id
    );

    this.nodes = await (this.getNodeBuilder
      ? this.getNodeBuilder.buildNodes()
      : ([] as ModuleNodes[]));
  }

  private async getCurrentPackageDescription(
    packageName: string
  ): Promise<CurrentPackageDescription | null> {
    const { _ } = ecoFlow;

    if ((await this.installedModules).includes(packageName)) {
      const ecoPackage = Helper.requireUncached(
        path.join(this.nodesPath, packageName, "package.json")
      );
      const packageDescription: PackageJSON | null =
        !_.isUndefined(ecoPackage.keywords) &&
        !_.isEmpty(ecoPackage.keywords) &&
        ecoPackage.keywords.includes("EcoFlow") &&
        ecoPackage.keywords.includes("EcoFlowModule")
          ? Helper.requireUncached(
              path.join(this.nodesPath, packageName, "package.json")
            )
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

  getModuleSchema(
    moduleID?: string | EcoModuleID
  ): ModuleSchema & ModuleSchema[] {
    const { _ } = ecoFlow;

    if (_.isUndefined(moduleID))
      return <ModuleSchema & ModuleSchema[]>[...this.moduleSchema];

    if (_.isObject(moduleID)) moduleID = moduleID._id;

    if (_.isString(moduleID)) moduleID = new EcoModule.IDBuilders(moduleID)._id;

    const moduleSchema = this.moduleSchema.filter(
      (m) => m.module?.id._id === moduleID
    );

    return <ModuleSchema & ModuleSchema[]>(
      (moduleSchema.length > 0 ? moduleSchema[0] : null)
    );
  }

  getModule(moduleID?: string): (Module | null) & Module[] {
    const { _ } = ecoFlow;

    if (_.isUndefined(moduleID))
      return <(Module | null) & Module[]>this.moduleSchema.map((m) => m.module);

    const module = this.moduleSchema.filter(
      (m) => m.module?.id._id === moduleID
    );
    return <(Module | null) & Module[]>(
      (module.length > 0 ? module[0].module : null)
    );
  }

  async getNodes(
    nodeID?: string,
    inputValuePass?: { [key: string]: any }
  ): Promise<(EcoNode | null) & EcoNodes> {
    const { _ } = ecoFlow;

    if (_.isUndefined(nodeID))
      return <(EcoNode | null) & EcoNodes>(<unknown>[...this.nodes]);

    const node: ModuleNodes[] = _.cloneDeep(
      this.nodes.filter((n) => n.id._id === nodeID)
    );

    for await (const n of node) {
      if (n.inputs)
        for await (const input of n.inputs) {
          for await (const params of Object.keys(input)) {
            if (_.isFunction((<any>input)[params]))
              (<any>input)[params] = await (<any>input)[params](inputValuePass);
          }
        }
    }

    return <(EcoNode | null) & EcoNodes>(node.length > 0 ? node[0] : null);
  }

  async isEcoModule(
    moduleName: string | PackageSearchResult
  ): Promise<boolean> {
    const { _ } = ecoFlow;

    const module = _.isString(moduleName)
      ? await this.getManifest(moduleName)
      : moduleName;
    if (
      module !== null &&
      !_.isUndefined(module.keywords) &&
      module.keywords.includes("EcoFlow") &&
      module.keywords.includes("EcoFlowModule")
    )
      return true;
    return false;
  }

  async getInstalledPackagesDescription(
    packageName: string
  ): Promise<InstalledPackagesDescription> {
    const currentModule = await this.getCurrentPackageDescription(packageName);
    const searchModule = (await this.searchPackages(packageName))!.objects;

    if (currentModule === null) {
      if (searchModule.length > 0) {
        const { name, version, author } = searchModule[0].package;
        return {
          name: packageName,
          currentVersion: "0.0.0",
          latestVersion: name === packageName ? version : "0.0.0",
          author: author && name === packageName ? author : "N/A",
          download:
            name === packageName
              ? await this.getDownloadCount(packageName)
              : "N/A",
          isInUse: false,
          isLocalPackage: false,
        };
      }
      return {
        name: packageName,
        currentVersion: "0.0.0",
        latestVersion: "0.0.0",
        author: "N/A",
        download: "N/A",
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
        author: author && name === currentPackageName ? author : "N/A",
        download:
          name === currentPackageName
            ? await this.getDownloadCount(packageName)
            : "N/A",
        isInUse,
        isLocalPackage,
      };
    }
    return {
      name: currentPackageName,
      currentVersion: currentVersion,
      latestVersion: "0.0.0",
      author: "N/A",
      download: "N/A",
      isInUse,
      isLocalPackage,
    };
  }

  async searchModule(moduleName: string): Promise<ModuleSearchResults> {
    const { objects: searchResults, total } = await this.searchPackages(
      moduleName
    );

    const modules: ModuleResults[] = [];
    if (searchResults && searchResults.length > 0) {
      const installedPackage = await new Promise<CurrentPackageDescription[]>(
        async (resolve) => {
          const result: CurrentPackageDescription[] = [];
          for await (const installedModule of await this.installedModules) {
            const packageDescription = await this.getCurrentPackageDescription(
              installedModule
            );
            if (packageDescription !== null) result.push(packageDescription);
          }

          resolve(result);
        }
      );

      for await (const { package: searchResult } of searchResults) {
        const packument = new TPromise<unknown[], Packument, void>(
          (resolve, reject) =>
            this.getPackument(searchResult.name).then(resolve, reject)
        );

        const resultPayload: ModuleResults = {
          name: searchResult.name,
          author: searchResult.author,
          versions: [],
          isInstalled: false,
          inUsed: false,
          latestVersion: "",
          installedVersions: null,
        };
        const installedModule = installedPackage.filter(
          (installedPackage) => installedPackage.name === searchResult.name
        );
        if (installedModule.length > 0) {
          resultPayload.isInstalled = true;
          resultPayload.installedVersions = installedModule[0].version;
          resultPayload.inUsed = installedModule[0].isInUse;
        }

        const { distTags, versions, gitRepository } = await packument;

        resultPayload.versions = Object.keys(versions);
        resultPayload.latestVersion = distTags.latest;
        resultPayload.gitRepository = gitRepository
          ? gitRepository.url
          : undefined;

        modules.push(resultPayload);
      }
    }

    return {
      modules,
      total,
    };
  }

  async upgradeDowngradeModule(
    moduleName: string,
    version: string
  ): Promise<ModuleSchema> {
    const { _ } = ecoFlow;

    const module = await this.installedModules;
    if (!_.isEmpty(module) && !_.isUndefined(module.includes(moduleName))) {
      const currentVersion = await this.getModuleSchema(moduleName);
      if (currentVersion.version === version)
        throw "Current version and new version are same";

      await Helper.installPackageHelper(
        this.modulePath,
        `${moduleName}@${version}`
      );
    }

    return await this.moduleBuilder.build(moduleName);
  }

  async installModule(
    moduleName: string,
    version: string = "latest"
  ): Promise<ModuleSchema> {
    const { _ } = ecoFlow;

    const module = await this.getManifest(moduleName);
    if (
      module !== null &&
      !_.isUndefined(module.keywords) &&
      module.keywords.includes("EcoFlow") &&
      module.keywords.includes("EcoFlowModule")
    )
      await Helper.installPackageHelper(
        this.modulePath,
        `${moduleName}@${version}`
      );

    return await this.moduleBuilder.build(moduleName);
  }

  async installLocalModule(moduleName: string[]): Promise<ModuleSchema[]> {
    const { _, config } = ecoFlow;
    const modulesName: {
      path: string;
      name: string;
    }[] = [];
    for await (const module of moduleName) {
      const file = new StreamZip.async({
        file: path.join(config._config.userDir!, "uploads", module),
      });
      if (!Object.keys(await file.entries()).includes("package.json")) continue;
      const packageJSON = JSON.parse(
        (await file.entryData("package.json")).toString("utf8")
      );
      if (!(await this.isEcoModule(packageJSON))) continue;

      const localModuleName = packageJSON.name;
      modulesName.map((module, index, localModules) =>
        module.name === localModuleName ? localModules.splice(index, 1) : null
      );
      const localModuleNodePath = path.join(
        this.localModulePaths,
        localModuleName
      );
      if (await fse.exists(localModuleNodePath)) {
        await this.removeModule(localModuleName);
        await fse.remove(localModuleNodePath);
      }

      await fse.ensureDir(localModuleNodePath);
      await file.extract(null, localModuleNodePath);
      await file.close();

      modulesName.push({ path: localModuleNodePath, name: localModuleName });
    }

    const schema: ModuleSchema[] = [];

    for await (const module of modulesName) {
      await Helper.installPackageHelper(this.modulePath, `${module.path}`);
      schema.push(await this.moduleBuilder.build(module.name));
    }

    return schema;
  }

  async removeModule(moduleName: string): Promise<void> {
    await Helper.removePackageHelper(this.modulePath, moduleName);
    await this.dropModule(new EcoModule.IDBuilders(moduleName));
  }

  async registerModules(): Promise<void> {
    const { log } = ecoFlow;
    try {
      this.moduleSchema = await this.moduleBuilder.build(
        await this.installedModules
      );
      this.nodes = await (this.getNodeBuilder
        ? this.getNodeBuilder.buildNodes()
        : ([] as ModuleNodes[]));
    } catch (error) {
      log.error(error);
    }
  }

  get availablePackagesCounts(): Promise<Number> {
    return new Promise<Number>(async (resolve, reject) => {
      searchPackages({
        query: { text: "keywords:EcoFlow EcoFlowModule" },
      }).then(({ total }) => resolve(total), reject);
    });
  }

  get moduleBuilder(): IEcoModuleBuilder {
    return new EcoModuleBuilder(this.nodesPath);
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
