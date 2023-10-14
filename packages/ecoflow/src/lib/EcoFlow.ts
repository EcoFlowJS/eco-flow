import { Config } from "../config";
import { EcoFlowArgs, ICommand, configSettings } from "@eco-flow/types";
import { has, omit, merge, set } from "lodash";
import dotenv, { config } from "dotenv";
import { Logger } from "@eco-flow/utils";
import EcoFactory from "./factory";

export class EcoFlow {
  private isCliPasses: boolean = false;
  private cliArgs: ICommand = {};
  private ecoConfig!: Config;
  private ecoLogger!: Logger;
  constructor(args: EcoFlowArgs = {}) {
    if (has(args, "cli")) {
      this.isCliPasses = true;
      this.cliArgs = { ...args.cli };
    }
  }

  private init() {
    dotenv.config();
    if (!has(this.cliArgs, "configDir")) {
      if (has(process.env, "configDir"))
        this.cliArgs.configDir = process.env.configDir;
    }
    this.ecoConfig = new Config(
      this.cliArgs.configDir,
      this.cliArgs.configName
    );
    const configCli = omit(this.cliArgs, ["configDir", "configName", "auth"]);
    this.tempUpdateConfig(configCli);
    this.ecoLogger = new Logger({ logging: this.ecoConfig.get("logging") });
  }

  private tempUpdateConfig(config: configSettings) {
    ecoFlow.config = merge(ecoFlow.config, config);
  }

  start(): void {
    this.init();
  }

  get config(): Config {
    return this.ecoConfig;
  }

  get logger(): Logger {
    return this.ecoLogger;
  }

  static get Version(): string {
    let packageVersion: string = require("../../package.json").version;
    return packageVersion;
  }
}
