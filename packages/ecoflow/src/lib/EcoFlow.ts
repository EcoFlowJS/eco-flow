import { Config } from "../config";
import { EcoOptions, ICommand } from "@eco-flow/types";
import { has, omit } from "lodash";
import dotenv from "dotenv";
import { Logger } from "@eco-flow/utils";
import EcoContainer from "./EcoContainer";
import { EcoFlow as IEcoFlow } from "@eco-flow/types";

export type loadedEcoFlow = Required<EcoFlow>;
class EcoFlow implements IEcoFlow {
  isAuth: boolean = false;
  private cliArgs: ICommand = {};
  private container!: EcoContainer;
  constructor(args: EcoOptions = {}) {
    global.ecoFlow = this;
    if (has(args, "cli")) this.cliArgs = { ...args.cli };
  }

  private init() {
    dotenv.config();
    if (!has(this.cliArgs, "configDir")) {
      if (has(process.env, "configDir"))
        this.cliArgs.configDir = process.env.configDir;
    }

    let configDir = undefined;
    let configName = undefined;

    if (has(this.cliArgs, "auth")) this.isAuth = true;
    if (has(this.cliArgs, "configDir")) configDir = this.cliArgs.configDir;
    if (has(this.cliArgs, "configName")) configName = this.cliArgs.configName;
    const configCli = omit(this.cliArgs, ["configDir", "configName", "auth"]);

    this.container = new EcoContainer();

    this.container
      .register(
        "config",
        new Config(this.cliArgs.configDir, this.cliArgs.configName, configCli)
      )
      .register("logger", new Logger());
  }

  start(): EcoFlow {
    this.init();
    return this;
  }

  get config() {
    return this.container.get("config");
  }

  get logger() {
    return this.container.get("logger");
  }

  static get Version(): string {
    let packageVersion: string = require("../../package.json").version;
    return packageVersion;
  }
}

export default EcoFlow;