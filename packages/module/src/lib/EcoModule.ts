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
import { EcoModuleBuilder } from "./EcoModuleBuilder.js";
import { EcoModuleID } from "./Builders/EcoModuleID.js";
import { EcoNodeBuilder } from "./EcoNodeBuilder.js";
import TPromise from "thread-promises";
import StreamZip from "node-stream-zip";

/**
 * Represents an EcoModule that implements the EcoModule interface.
 * This class manages the module schema, nodes, paths, and various operations related to EcoModules.
 */
export class EcoModule implements IEcoModule {
  private moduleSchema: ModuleSchema[] = [];
  private nodes: ModuleNodes[] = [];
  private modulePath: string;
  private nodesPath: string;
  private localModulePaths: string;

  /**
   * Constructor function for initializing the EcoFlow module paths.
   * It sets the module path based on the configuration provided.
   * @returns None
   */
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

  /**
   * Asynchronously retrieves a list of installed modules that meet specific criteria.
   * @returns A Promise that resolves to an array of strings representing the names of the installed modules.
   */
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

  /**
   * Retrieves the package manifest for a given module name.
   * @param {string} moduleName - The name of the module to retrieve the manifest for.
   * @returns {Promise<PackageManifest | null>} A promise that resolves to the package manifest
   * for the specified module name, or null if the manifest cannot be retrieved.
   */
  private async getManifest(
    moduleName: string
  ): Promise<PackageManifest | null> {
    try {
      return await getPackageManifest({ name: moduleName, cached: true });
    } catch {
      return null;
    }
  }

  /**
   * Retrieves the packument (package document) for a given package name.
   * @param {string} packageName - The name of the package to retrieve the packument for.
   * @returns {Promise<Packument>} A promise that resolves to the packument of the specified package.
   */
  private async getPackument(packageName: string): Promise<Packument> {
    return await getPackument({
      name: packageName,
      cached: true,
    });
  }

  /**
   * Retrieves the download count for a given npm module name.
   * @param {string} moduleName - The name of the npm module to retrieve download count for.
   * @returns {Promise<string | number>} A promise that resolves to the download count as a string or number,
   * or "N/A" if the download count is not available.
   */
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

  /**
   * Searches for packages based on the provided module name.
   * @param {string} moduleName - The name of the module to search for.
   * @returns {Promise<SearchResults>} A promise that resolves to the search results.
   */
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

  /**
   * Retrieves the current package description for a given package name.
   * @param {string} packageName - The name of the package to retrieve the description for.
   * @returns {Promise<CurrentPackageDescription | null>} A promise that resolves to the current package description
   * or null if the package is not found.
   */
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

  /**
   * Asynchronously adds a module or an array of modules to the module schema.
   * If an array of modules is provided, it iterates through each module and adds it.
   * @param {ModuleSchema | ModuleSchema[]} module - The module or array of modules to add.
   * @returns {Promise<void>} A promise that resolves once the module(s) have been added.
   */
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

  /**
   * Updates a module or an array of modules in the module schema.
   * @param {ModuleSchema | ModuleSchema[]} module - The module or array of modules to update.
   * @returns Promise<void>
   */
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

  /**
   * Asynchronously drops a module or an array of modules from the system.
   * @param {EcoModuleID | EcoModuleID[]} moduleID - The ID or array of IDs of the module(s) to drop.
   * @returns {Promise<void>} A promise that resolves once the module(s) have been dropped.
   */
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

  /**
   * Retrieves the module schema based on the provided module ID.
   * @param {string | EcoModuleID} [moduleID] - The ID of the module to retrieve the schema for.
   * @returns {ModuleSchema & ModuleSchema[]} The module schema matching the provided module ID.
   */
  getModuleSchema(
    moduleID?: string | EcoModuleID
  ): ModuleSchema & ModuleSchema[] {
    const { _ } = ecoFlow;

    /**
     * If the moduleID is undefined, return a copy of the moduleSchema array.
     * @param {any} moduleID - The ID of the module to retrieve.
     * @returns {ModuleSchema & ModuleSchema[]} A copy of the moduleSchema array.
     */
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

  /**
   * Retrieves a module based on the provided moduleID.
   * If no moduleID is provided, returns an array of all modules.
   * @param {string} [moduleID] - The ID of the module to retrieve.
   * @returns {(Module | null) & Module[]} - The module matching the moduleID, or an array of all modules if moduleID is not provided.
   */
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

  /**
   * Retrieves nodes based on the provided node ID and input values.
   * @param {string} [nodeID] - The ID of the node to retrieve. If not provided, returns all nodes.
   * @param {Object} [inputValuePass={}] - Input values to pass to the nodes.
   * @returns {Promise<(EcoNode | null) & EcoNodes>} A promise that resolves to the retrieved node or null.
   */
  async getNodes(
    nodeID?: string,
    inputValuePass: { [key: string]: any } = {}
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

  /**
   * Checks if a given module is an EcoFlow module by examining its keywords.
   * @param {string | PackageSearchResult} moduleName - The name of the module or a PackageSearchResult object.
   * @returns {Promise<boolean>} A promise that resolves to true if the module is an EcoFlow module, false otherwise.
   */
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

  /**
   * Retrieves the description of an installed package based on the package name.
   * @param {string} packageName - The name of the package to retrieve the description for.
   * @returns {Promise<InstalledPackagesDescription>} A promise that resolves to an object containing
   * the details of the installed package, such as name, versions, author, download count, and usage status.
   */
  async getInstalledPackagesDescription(
    packageName: string
  ): Promise<InstalledPackagesDescription> {
    const currentModule = await this.getCurrentPackageDescription(packageName);
    const searchModule = (await this.searchPackages(packageName))!.objects;

    /**
     * Checks if the current module is null and returns an object with package information.
     * @param {string} currentModule - The current module being checked.
     * @param {Array} searchModule - An array of modules to search through.
     * @param {string} packageName - The name of the package being checked.
     * @returns An object containing package information such as name, version, author, download count, and usage status.
     */
    if (currentModule === null) {
      /**
       * Checks if the searchModule array has elements and returns an object with package information.
       * If searchModule has elements, it extracts the name, version, and author of the first package.
       * It then returns an object with package details including name, currentVersion, latestVersion,
       * author, download count, isInUse status, and isLocalPackage status.
       * @returns An object with package information.
       */
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

    /**
     * Checks if the searchModule array has elements and returns an object with package information.
     * @param {Array} searchModule - An array of search results for a package.
     * @param {string} currentPackageName - The name of the current package.
     * @param {string} currentVersion - The current version of the package.
     * @param {boolean} isInUse - Flag indicating if the package is in use.
     * @param {boolean} isLocalPackage - Flag indicating if the package is a local package.
     * @returns An object containing package information such as name, version, author, download count, and flags.
     */
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

  /**
   * Searches for a module by name and returns detailed information about the module.
   * @param {string} moduleName - The name of the module to search for.
   * @returns {Promise<ModuleSearchResults>} A promise that resolves to an object containing
   * detailed information about the searched module.
   */
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

      /**
       * Iterates over search results and retrieves detailed information about each package.
       * @param {Array} searchResults - An array of search results containing package information.
       * @param {Array} installedPackage - An array of installed packages.
       * @param {Array} modules - An array to store detailed information about each package.
       * @returns None
       */
      for await (const { package: searchResult } of searchResults) {
        const packument = new TPromise.default<unknown[], Packument, void>(
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

  /**
   * Upgrades or downgrades a module to the specified version.
   * @param {string} moduleName - The name of the module to upgrade/downgrade.
   * @param {string} version - The version to upgrade/downgrade to.
   * @returns {Promise<ModuleSchema>} The module schema of the upgraded/downgraded module.
   */
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

  /**
   * Asynchronously installs a module with the specified name and version.
   * @param {string} moduleName - The name of the module to install.
   * @param {string} [version="latest"] - The version of the module to install.
   * @returns {Promise<ModuleSchema>} A promise that resolves to the installed module schema.
   */
  async installModule(
    moduleName: string,
    version: string = "latest"
  ): Promise<ModuleSchema> {
    const { _ } = ecoFlow;

    /**
     * Asynchronously retrieves the manifest for a given module name.
     * @param {string} moduleName - The name of the module to retrieve the manifest for.
     * @returns {Promise<Object>} A promise that resolves to the manifest object of the module.
     */
    const module = await this.getManifest(moduleName);

    /**
     * Checks if the module is not null, has keywords including "EcoFlow" and "EcoFlowModule",
     * then installs the package using Helper.installPackageHelper.
     * @param {object} module - The module object to check.
     * @param {string} moduleName - The name of the module to install.
     * @param {string} version - The version of the module to install.
     * @returns None
     */
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

  /**
   * Asynchronously installs a module dependencies.
   * @returns {Promise<void>}
   */
  async installModules(): Promise<void> {
    if (await fse.exists(path.join(this.modulePath, "package.json")))
      await Helper.installPackageDependencies(this.modulePath);
  }

  /**
   * Installs local modules from the specified module names array.
   * @param {string[]} moduleName - An array of module names to install locally.
   * @returns {Promise<ModuleSchema[]>} A promise that resolves to an array of ModuleSchema objects.
   */
  async installLocalModule(moduleName: string[]): Promise<ModuleSchema[]> {
    const { _, config } = ecoFlow;
    const modulesName: {
      path: string;
      name: string;
    }[] = [];
    /**
     * Asynchronously iterates over each module in the moduleName array, extracts the package.json file,
     * checks if it is an Eco module, removes any existing module with the same name, and then extracts
     * the module to the local module path.
     * @param {Array<string>} moduleName - Array of module names to process
     * @returns None
     */
    for await (const module of moduleName) {
      /**
       * Creates a new StreamZip instance asynchronously with the given file path.
       * @param {string} file - The file path to create the StreamZip instance with.
       * @returns A promise that resolves to the StreamZip instance.
       */
      const file = new StreamZip.async({
        file: path.join(config._config.userDir!, "uploads", module),
      });

      /**
       * Checks if the "package.json" file is included in the list of entries in the file.
       * If it is not included, the loop continues to the next iteration.
       * @returns None
       */
      if (!Object.keys(await file.entries()).includes("package.json")) continue;

      const packageJSON = JSON.parse(
        (await file.entryData("package.json")).toString("utf8")
      );

      /**
       * Checks if the package is an Eco module by inspecting its package.json file.
       * If it is an Eco module, the loop continues to the next iteration.
       * @param {Object} packageJSON - The package.json file of the module.
       * @returns {boolean} - True if the package is an Eco module, false otherwise.
       */
      if (!(await this.isEcoModule(packageJSON))) continue;

      /**
       * Removes the module with the same name as the local module name from the modulesName array.
       * @param {string} localModuleName - The name of the local module.
       * @param {Array<{ name: string }>} modulesName - An array of modules with a name property.
       * @returns None
       */
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

    /**
     * Asynchronously iterates over an array of module names, installs each module package,
     * builds the module schema, and adds it to the schema array.
     * @param {Array} modulesName - An array of module names to iterate over.
     * @returns None
     */
    for await (const module of modulesName) {
      await Helper.installPackageHelper(this.modulePath, `${module.path}`);
      schema.push(await this.moduleBuilder.build(module.name));
    }

    return schema;
  }

  /**
   * Asynchronously removes a module by its name.
   * @param {string} moduleName - The name of the module to be removed.
   * @returns {Promise<void>} A promise that resolves once the module is successfully removed.
   */
  async removeModule(moduleName: string): Promise<void> {
    await Helper.removePackageHelper(this.modulePath, moduleName);
    await this.dropModule(new EcoModule.IDBuilders(moduleName));
  }

  /**
   * Asynchronously registers modules by building the module schema and nodes.
   * @returns A Promise that resolves when the modules are successfully registered.
   */
  async registerModules(): Promise<void> {
    const { log } = ecoFlow;
    try {
      this.moduleSchema = [];
      this.nodes = [];
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

  /**
   * Asynchronously retrieves the total count of available packages that match the specified query.
   * @returns {Promise<Number>} A promise that resolves with the total count of available packages.
   */
  get availablePackagesCounts(): Promise<Number> {
    return new Promise<Number>(async (resolve, reject) => {
      searchPackages({
        query: { text: "keywords:EcoFlow EcoFlowModule" },
      }).then(({ total }) => resolve(total), reject);
    });
  }

  /**
   * Returns an instance of EcoModuleBuilder using the nodesPath property of the current object.
   * @returns An instance of IEcoModuleBuilder
   */
  get moduleBuilder(): IEcoModuleBuilder {
    return new EcoModuleBuilder(this.nodesPath);
  }

  /**
   * Returns an instance of IEcoNodeBuilder if moduleSchema is defined, otherwise returns null.
   * @returns {IEcoNodeBuilder | null} An instance of IEcoNodeBuilder if moduleSchema is defined, otherwise null.
   */
  get getNodeBuilder(): IEcoNodeBuilder | null {
    return this.moduleSchema ? new EcoNodeBuilder(this.moduleSchema) : null;
  }

  /**
   * Asynchronously retrieves a list of installed modules.
   * @returns {Promise<string[]>} A promise that resolves with an array of installed module names.
   */
  get installedModules(): Promise<string[]> {
    return new Promise<string[]>((resolve) =>
      resolve(this.getInstalledModules())
    );
  }

  /**
   * Returns the EcoModuleID class, which contains static methods for building IDs.
   * @returns typeof EcoModuleID - The class containing static methods for building IDs.
   */
  static get IDBuilders(): typeof EcoModuleID {
    return EcoModuleID;
  }
}
