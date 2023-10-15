import { Config } from "../config";
import { EcoOptions, ICommand } from "@eco-flow/types";
import { has, omit } from "lodash";
import dotenv from "dotenv";
import { Logger } from "@eco-flow/utils";
import EcoContainer from "./EcoContainer";
import { EcoFlow as IEcoFlow } from "@eco-flow/types";
import { Server } from "../service/EcoServer";

export type loadedEcoFlow = Required<EcoFlow>;
class EcoFlow implements IEcoFlow {
  isAuth: boolean = false;

  server: Server;

  private container!: EcoContainer;

  constructor(args: EcoOptions = {}) {
    global.ecoFlow = this;
    dotenv.config();
    let cliArgs: ICommand = {};
    if (has(args, "cli")) cliArgs = { ...args.cli };

    if (!has(cliArgs, "configDir")) {
      if (has(process.env, "configDir"))
        cliArgs.configDir = process.env.configDir;
    }

    let configDir = undefined;
    let configName = undefined;

    if (has(cliArgs, "auth")) this.isAuth = true;
    if (has(cliArgs, "configDir")) configDir = cliArgs.configDir;
    if (has(cliArgs, "configName")) configName = cliArgs.configName;
    const configCli = omit(cliArgs, ["configDir", "configName", "auth"]);

    this.container = new EcoContainer();
    this.container
      .register("config", new Config(configDir, configName, configCli))
      .register("logger", new Logger());

    this.server = new Server(this);
  }

  start(): EcoFlow {
    return this;
  }

  stop(): EcoFlow {
    return this;
  }

  get config() {
    return this.container.get("config");
  }

  get logger() {
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