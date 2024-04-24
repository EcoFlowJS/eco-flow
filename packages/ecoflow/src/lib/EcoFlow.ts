import { Config } from "../config";
import {
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

interface ProcessCommands {
  STOP: string;
  RESTART: string;
}

class EcoFlow implements IEcoFlow {
  private helper: EcoHelper;

  isAuth: boolean = false;
  _: typeof _ = _;
  server: EcoServer;
  socket: SocketServer;
  router: EcoRouter;
  container: EcoContainer;

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
      .register("config", new Config(configDir, configName, configCli))
      .register("logger", new Logger())
      .register("database", new Database())
      .register("module", new EcoModule())
      .register("flowEditor", new EcoFlowEditor())
      .register("service", new Service());

    this.server = new EcoServer();
    this.socket = this.server.userSocket;
    this.router = new EcoRouter();
    this.helper = new EcoHelper(this);

    loadEnvironments();
  }

  async start(): Promise<EcoFlow> {
    this.log.info("====================================");
    this.log.info("Starting Application....");

    if (!this.helper.isCreateApp()) {
      await this.helper.generateFiles();
      loadEnvironments();
    }

    await this.database.initConnection();
    await this.router.initRouter(this.server);

    await this.ecoModule.registerModules();
    await this.flowEditor.initialize();

    await this.helper.loadEditor();
    await this.helper.loadSystemRoutes();
    await this.server.initializePassport();
    await this.server.startServer();
    this.log.info("Server Ready to use!!!");
    return this;
  }

  get config(): Config {
    return this.container.get("config");
  }

  get database(): IDatabase {
    return this.container.get("database");
  }

  get ecoModule(): IEcoModule {
    return this.container.get("module");
  }

  get flowEditor(): IEcoFlowEditor {
    return this.container.get("flowEditor");
  }

  get service(): IService {
    return this.container.get("service");
  }

  get log(): ILogger {
    return this.container.get("logger");
  }

  get Version(): string {
    let packageVersion: string = require("../../package.json").version;
    return packageVersion;
  }

  static get Version(): string {
    let packageVersion: string = require("../../package.json").version;
    return packageVersion;
  }

  static get processCommands(): ProcessCommands {
    return {
      STOP: "stop",
      RESTART: "restart",
    };
  }
}

export default EcoFlow;
