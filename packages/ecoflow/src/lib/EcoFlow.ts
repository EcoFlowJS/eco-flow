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

export type loadedEcoFlow = Required<EcoFlow>;
class EcoFlow implements IEcoFlow {
  isAuth: boolean = false;

  _: typeof _ = _;

  server: EcoServer;
  router: EcoRouter;

  container: EcoContainer;

  constructor(args: EcoOptions = {}) {
    global.ecoFlow = this;
    dotenv.config();
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
      .register("helper", new EcoHelper(this));

    this.server = new EcoServer();
    this.router = new EcoRouter(this.server);
  }

  start(): EcoFlow {
    this.server.startServer();
    return this;
  }

  get config() {
    return this.container.get("config");
  }

  get log() {
    return this.container.get("logger");
  }

  get helper() {
    return this.container.get("helper");
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