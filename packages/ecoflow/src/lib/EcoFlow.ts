import { Config } from "../config";
import { EcoOptions, ICommand } from "@eco-flow/types";
import _ from "lodash";
import dotenv from "dotenv";
import { Logger } from "@eco-flow/utils";
import EcoContainer from "./EcoContainer";
import { EcoFlow as IEcoFlow } from "@eco-flow/types";
import { EcoServer } from "../service/EcoServer";
import { EcoRouter } from "../service/EcoRouter";
import { EcoHelper } from "./EcoHelper";
import { homedir } from "os";
import fs from "fs";
import { Database } from "@eco-flow/database";
import loadAdmin from "@eco-flow/admin-panel";

export type loadedEcoFlow = Required<EcoFlow>;
class EcoFlow implements IEcoFlow {
  isAuth: boolean = false;

  _: typeof _ = _;

  server: EcoServer;
  router: EcoRouter;
  helper: EcoHelper;

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

    if (!this._.isEmpty(cliArgs.auth)) this.isAuth = cliArgs.auth!;
    if (!this._.isEmpty(cliArgs.configDir)) configDir = cliArgs.configDir;
    if (!this._.isEmpty(cliArgs.configName)) configName = cliArgs.configName;
    const configCli = this._.omit(cliArgs, ["configDir", "configName", "auth"]);

    this.container = new EcoContainer();
    this.container
      .register("config", new Config(configDir, configName, configCli))
      .register("logger", new Logger())
      .register("database", new Database().DB);

    ////////////////////////////////////////////////

    console.log(this.database);

    ////////////////////////////////////////////////

    let envDir =
      process.env.configDir ||
      homedir().replace(/\\/g, "/") + "/.ecoflow/environment";
    envDir = this._.isEmpty(this.config._config.envDir)
      ? envDir
      : this.config._config.envDir;

    this.loadUserEnvironment(envDir);

    this.server = new EcoServer();
    this.router = new EcoRouter(this.server);

    this.helper = new EcoHelper(this);

    this.helper.loadEditor();
    this.helper.loadSystemRoutes();
  }

  private loadUserEnvironment(path: string) {
    while (path.charAt(path.length - 1) === "/")
      path = path.substring(0, path.length - 1);
    if (fs.existsSync(path + "/ecoflow.environments.env"))
      dotenv.config({ path: path + "/ecoflow.environments.env" });
    if (fs.existsSync(path + "/user.environments.env"))
      dotenv.config({ path: path + "/user.environments.env" });
  }

  start(): EcoFlow {
    this.server.startServer();
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
