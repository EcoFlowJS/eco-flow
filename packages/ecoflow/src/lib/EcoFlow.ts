import { Config } from "../config";
import { EcoFlowArgs, ICommand, configSettings } from "@eco-flow/types";
import { has, omit, merge, set } from "lodash";
import dotenv, { config } from "dotenv";
import { Logger } from "@eco-flow/utils";
import EcoFactory from "./EcoContainer";
import EcoContainer from "./EcoContainer";

export class EcoFlow {
  private cliArgs: ICommand = {};
  private container!: EcoContainer;
  constructor(args: EcoFlowArgs = {}) {
    if (has(args, "cli")) this.cliArgs = { ...args.cli };
  }

  private init() {
    dotenv.config();
    if (!has(this.cliArgs, "configDir")) {
      if (has(process.env, "configDir"))
        this.cliArgs.configDir = process.env.configDir;
    }
    this.container = new EcoContainer();
    this.container.register(
      "config",
      new Config(this.cliArgs.configDir, this.cliArgs.configName)
    );
    const configCli = omit(this.cliArgs, ["configDir", "configName", "auth"]);
    this.tempUpdateConfig(configCli);
    this.container
      .register("logger", new Logger(ecoFlow.config!))
      .register("abc", abc)
      .get("abc");
  }

  private tempUpdateConfig(config: configSettings) {
    ecoFlow.config = merge(ecoFlow.config, config);
  }

  start(): void {
    this.init();
  }

  get config(): Config {
    return this.container.get("config");
  }

  get logger(): Logger {
    return this.container.get("loggger");
  }

  static get Version(): string {
    let packageVersion: string = require("../../package.json").version;
    return packageVersion;
  }
}

class abc {
  constructor() {
    console.log("hi");
  }
}