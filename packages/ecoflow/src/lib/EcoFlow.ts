import { Config } from "../config";
import { EcoOptions, ICommand } from "@eco-flow/types";
import _ from "lodash";
import { Logger } from "@eco-flow/utils";
import EcoContainer from "./EcoContainer";
import { EcoFlow as IEcoFlow } from "@eco-flow/types";
import { EcoServer } from "../service/EcoServer";
import { EcoRouter } from "../service/EcoRouter";
import { EcoHelper } from "./EcoHelper";
import { Database } from "@eco-flow/database";
import { Service } from "@eco-flow/services";
import EcoModule from "@eco-flow/module";
import loadEnvironments from "../helper/env.helper";
import Helper from "@eco-flow/helper";

export type loadedEcoFlow = Required<EcoFlow>;
class EcoFlow implements IEcoFlow {
  private helper: EcoHelper;

  isAuth: boolean = false;
  _: typeof _ = _;
  server: EcoServer;
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
      .register("service", new Service());

    this.server = new EcoServer();
    this.router = new EcoRouter();
    this.helper = new EcoHelper(this);

    loadEnvironments();
  }

  async start(): Promise<EcoFlow> {
    if (!this.helper.isCreateApp()) {
      await this.helper.generateFiles();
      loadEnvironments();
    }
    await this.server.startServer();
    await this.server.initializePassport();
    await this.database.initConnection();
    await this.router.initRouter(this.server);

    await this.ecoModule.register();
    console
      .log
      // Helper.generateJwtToken({ _id: "admin" }, { expiresIn: "10h" })
      ();

    await this.helper.loadEditor();
    await this.helper.loadSystemRoutes();
    return this;
  }

  get config(): Config {
    return this.container.get("config");
  }

  get database(): Database {
    return this.container.get("database");
  }

  get ecoModule(): EcoModule {
    return this.container.get("module");
  }

  get service(): Service {
    return this.container.get("service");
  }

  get log(): Logger {
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
}

export default EcoFlow;
