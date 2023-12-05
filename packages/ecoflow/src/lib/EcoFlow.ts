import { Config } from "../config";
import {
  ClassType,
  DriverMongoose,
  EcoOptions,
  ICommand,
} from "@eco-flow/types";
import _ from "lodash";
import dotenv from "dotenv";
import { Logger } from "@eco-flow/utils";
import EcoContainer from "./EcoContainer";
import { EcoFlow as IEcoFlow } from "@eco-flow/types";
import { EcoServer } from "../service/EcoServer";
import { EcoRouter } from "../service/EcoRouter";
import { EcoHelper } from "./EcoHelper";
import { homedir } from "os";
import fse from "fs-extra";
import path from "path";
import { Database } from "@eco-flow/database";

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
      .register("database", new Database());

    ////////////////////////////////////////////////

    let abc: ClassType<DriverMongoose> = this.database.initConnection(
      "mongotext",
      "mongoose"
    );
    let driver = new abc();
    console.log(
      new (driver.buildModel("test", { definition: { name: String } }))({
        name: "test",
      })
    );
    console.log(driver);

    ////////////////////////////////////////////////

    this.server = new EcoServer();
    this.router = new EcoRouter();
    this.helper = new EcoHelper(this);

    this.loadEnvironments();
  }

  private loadEnvironments() {
    const envDir = this._.isEmpty(this.config._config.envDir)
      ? process.env.configDir ||
        homedir().replace(/\\/g, "/") + "/.ecoflow/environment"
      : fse.lstatSync(this.config._config.envDir).isDirectory()
      ? this.config._config.envDir
      : process.env.configDir ||
        homedir().replace(/\\/g, "/") + "/.ecoflow/environment";

    const ecosystemEnv = path.join(envDir, "/ecoflow.environments.env");
    const userEnv = path.join(envDir, "/user.environments.env");
    fse.ensureFileSync(ecosystemEnv);
    fse.ensureFileSync(userEnv);

    //import environments
    dotenv.config({ path: ecosystemEnv });
    dotenv.config({ path: userEnv });
  }

  async start(): Promise<EcoFlow> {
    if (this.helper.isCreateApp()) {
      await this.helper.generateFiles();
      this.loadEnvironments();
    }
    await this.server.startServer();
    await this.router.initRouter(this.server);

    await this.helper.loadEditor();
    await this.helper.loadSystemRoutes();
    return this;
  }

  get config() {
    return this.container.get("config");
  }

  get database() {
    return this.container.get("database");
  }

  get log() {
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
