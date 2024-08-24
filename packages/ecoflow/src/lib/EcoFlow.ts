import { Config } from "../config";
import {
  ModuleConfigs as IModuleConfigs,
  EcoFlowEditor as IEcoFlowEditor,
  EcoModule as IEcoModule,
  Service as IService,
  Database as IDatabase,
  Logger as ILogger,
  EcoOptions,
  ICommand,
} from "@ecoflow/types";
import _ from "lodash";
import { Logger } from "@ecoflow/utils";
import EcoContainer from "./EcoContainer";
import { EcoFlow as IEcoFlow } from "@ecoflow/types";
import { EcoServer } from "../service/EcoServer";
import { EcoRouter } from "../service/EcoRouter";
import { EcoHelper } from "./EcoHelper";
import { Database } from "@ecoflow/database";
import { Service } from "@ecoflow/services";
import { Server as SocketServer } from "socket.io";
import EcoModule from "@ecoflow/module";
import loadEnvironments from "../helper/env.helper";
import { EcoFlowEditor } from "@ecoflow/flows";
import defaultModules from "../defaults/defaultModules";
import { ModuleConfigs } from "./ModuleConfigs";

/**
 * Defines an interface for process commands with two properties: STOP and RESTART.
 */
interface ProcessCommands {
  /**
   * Represents the "STOP" string constant.
   */
  STOP: string;

  /**
   * Constant variable representing the "RESTART" string.
   */
  RESTART: string;
}

/**
 * Represents an EcoFlow class that implements the EcoFlow interface.
 * @class
 */
class EcoFlow implements IEcoFlow {
  private helper: EcoHelper;

  /**
   * A boolean flag indicating whether the user is authenticated or not.
   */
  isAuth: boolean = false;

  /**
   * Assigns the underscore (_) to a variable of the same name.
   * @param {typeof _} _ - The underscore (_) object.
   * @returns The assigned underscore (_) object.
   */
  _: typeof _ = _;

  /**
   * Represents an instance of an EcoServer.
   * @type {EcoServer} server - The EcoServer instance.
   */

  server: EcoServer;

  /**
   * Represents a socket server instance.
   * @type {SocketServer}
   */
  socket: SocketServer;

  /**
   * Represents an instance of an EcoRouter.
   */
  router: EcoRouter;

  /**
   * Represents a container for Eco objects.
   * @type {EcoContainer}
   */
  container: EcoContainer;

  /**
   * Constructor for the EcoOptions class.
   * @param {EcoOptions} [args={}] - An object containing optional arguments.
   * @returns None
   */
  constructor(args: EcoOptions = {}) {
    global.ecoFlow = this;
    let cliArgs: ICommand = {};
    if (this._.has(args, "cli")) cliArgs = { ...args.cli };

    if (!this._.has(cliArgs, "configDir")) {
      if (this._.has(process.env, "configDir"))
        cliArgs.configDir = process.env.configDir;
    }

    let configDir = undefined;
    let configName = undefined;

    if (this._.isBoolean(cliArgs.auth) && cliArgs.auth)
      this.isAuth = cliArgs.auth!;
    if (!this._.isEmpty(cliArgs.configDir)) configDir = cliArgs.configDir;
    if (!this._.isEmpty(cliArgs.configName)) configName = cliArgs.configName;
    const configCli = this._.omit(cliArgs, ["configDir", "configName", "auth"]);

    this.container = new EcoContainer();
    this.container
      .register("moduleConfigs", new ModuleConfigs())
      .register("config", new Config(configDir, configName, configCli))
      .register("logger", new Logger())
      .register("database", new Database())
      .register("module", new EcoModule())
      .register("flowEditor", new EcoFlowEditor())
      .register("service", new Service());

    this.server = new EcoServer();
    this.socket = this.server.socket;
    this.router = new EcoRouter();
    this.helper = new EcoHelper(this);

    loadEnvironments();
  }

  private async installBaseModulesNoAuth(): Promise<void> {
    /**
     * Asynchronously iterates over the defaultModules array and installs each module using ecoModule
     * if the authentication mode is disabled.
     * @param {Array} defaultModules - An array of modules to be installed.
     * @returns None
     */
    if (!this.isAuth) {
      this.log.info("Installing default modules using ecoModule");
      for await (const module of defaultModules)
        await this.ecoModule.installModule(module);
    }
  }

  /**
   * Asynchronously starts the application by initializing various components and services.
   * Logs the start of the application and checks if an app needs to be created.
   * Initializes database connection, router, modules, flow editor, editor, system routes,
   * passport authentication, and starts the server.
   * @returns {Promise<EcoFlow>} - A promise that resolves to the EcoFlow instance.
   */
  async start(): Promise<EcoFlow> {
    this.log.info("====================================");
    this.log.info("Starting Application....");

    if (!this.helper.isCreateApp()) {
      await this.helper.generateFiles();
      loadEnvironments();
    }

    await this.database.initConnection();
    await this.router.initRouter(this.server);

    await this.installBaseModulesNoAuth();
    await this.ecoModule.registerModules();
    await this.flowEditor.initialize();

    await this.helper.loadEditor();
    await this.helper.loadSystemRoutes();
    await this.server.initializePassport();

    await this.server.startServer();
    this.log.info("Server Ready to use!!!");
    return this;
  }

  /**
   * Getter method to retrieve the module configurations from the container.
   * @returns {IModuleConfigs} The module configurations obtained from the container.
   */
  get moduleConfigs(): IModuleConfigs {
    return this.container.get("moduleConfigs");
  }

  /**
   * Getter method to retrieve the configuration object from the container.
   * @returns {Config} The configuration object.
   */
  get config(): Config {
    return this.container.get("config");
  }

  /**
   * Getter method to retrieve the database instance from the container.
   * @returns {IDatabase} The database instance.
   */
  get database(): IDatabase {
    return this.container.get("database");
  }

  /**
   * Get the ecoModule from the container.
   * @returns {IEcoModule} The ecoModule object obtained from the container.
   */
  get ecoModule(): IEcoModule {
    return this.container.get("module");
  }

  /**
   * Getter method to retrieve the EcoFlowEditor instance from the container.
   * @returns {IEcoFlowEditor} The EcoFlowEditor instance.
   */
  get flowEditor(): IEcoFlowEditor {
    return this.container.get("flowEditor");
  }

  /**
   * Getter method to retrieve the service instance from the container.
   * @returns {IService} The service instance obtained from the container.
   */
  get service(): IService {
    return this.container.get("service");
  }

  /**
   * Getter method to retrieve the logger instance from the container.
   * @returns {ILogger} The logger instance.
   */
  get log(): ILogger {
    return this.container.get("logger");
  }

  /**
   * Retrieves the version number from the package.json file.
   * @returns The version number as a string.
   */
  get Version(): string {
    let packageVersion: string = require("../../package.json").version;
    return packageVersion;
  }

  /**
   * Get the version of the package from the package.json file.
   * @returns The version of the package as a string.
   */
  static get Version(): string {
    let packageVersion: string = require("../../package.json").version;
    return packageVersion;
  }

  /**
   * Returns an object containing process commands.
   * @returns {ProcessCommands} An object with process commands and their corresponding values.
   */
  static get processCommands(): ProcessCommands {
    return {
      STOP: "stop",
      RESTART: "restart",
    };
  }
}

export default EcoFlow;
