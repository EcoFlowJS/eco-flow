import * as cfgInterface from "@eco-flow/config";
import path from "path";
import fs from "fs";
import { homedir } from "os";
import { glob } from "glob";
import defaultConfig from "./default.config";

export class Config implements cfgInterface.Config {
  defaultConfig: cfgInterface.configSettings;
  configDir =
    process.env.configDir || homedir().replace(/\\/g, "/") + "/.ecoflow/config";
  configFile = path.join(this.configDir, "ecoflow.json");
  constructor() {
    this.defaultConfig = defaultConfig;
    this.loadConfig();
    return this;
  }

  private loadConfig(): void {
    let config = this.defaultConfig;
    if (fs.existsSync(this.configFile)) config = require(this.configFile);
    config = {
      ...this.defaultConfig,
      ...config,
    };
    global.config = config;
  }

  private getConfig(
    object: any,
    key: string | string[],
    isTypedArray: boolean = false
  ): any {
    if (isTypedArray) object = object.config;
    const elems = Array.isArray(key) ? key : key.split(".");
    const name = elems[0];
    const value = object[name];
    if (elems.length <= 1) {
      return value;
    }
    // Note that typeof null === 'object'
    if (value === null || typeof value !== "object") {
      return undefined;
    }
    return this.getConfig(value, elems.slice(1));
  }

  get(key: string): any {
    if (
      key === null ||
      typeof key !== "string" ||
      key === "" ||
      key === undefined
    )
      throw new Error(
        "Error getting configuration with key value null or undefined"
      );

    return this.getConfig({ config }, key, true);
  }

  private saveConfig(cfg: unknown = { config }): void {
    fs.writeFileSync(this.configFile, JSON.stringify(cfg, null, 2), {
      encoding: "utf8",
    });
  }

  private createConfigFile(): void {
    if (fs.existsSync(this.configFile)) return;
    if (!fs.existsSync(this.configDir))
      fs.mkdirSync(this.configDir, { recursive: true });

    this.saveConfig();
  }

  private updateConfigFile(cfg: cfgInterface.configSettings): void {
    if (fs.existsSync(this.configFile)) {
      const backupConfigPath = path.join(
        this.configDir,
        "backup_" + new Date().getTime() + ".json"
      );
      fs.renameSync(this.configFile, backupConfigPath);
    }
    this.saveConfig(cfg);
  }

  setConfig(cfg: cfgInterface.configSettings): cfgInterface.configSettings {
    if (!fs.existsSync(this.configFile)) this.createConfigFile();

    {
      config;
    }
    const updatedConfig: cfgInterface.configSettings = {
      ...this.defaultConfig,
      ...config,
      ...cfg,
    };

    this.updateConfigFile(updatedConfig);

    return updatedConfig;
  }

  async listBackupConfigs(): Promise<string[]> {
    return (await glob(this.configDir + "/backup_*.json")).map((file) => {
      const filePathSplit = file.split(/\\/g);
      const length = filePathSplit.length;
      return filePathSplit[length - 1];
    });
  }

  async deleteConfigFile(ConfigFileName: string): Promise<string[]> {
    if (fs.existsSync(this.configDir + "/" + ConfigFileName))
      fs.unlinkSync(this.configDir + "/" + ConfigFileName);
    return await this.listBackupConfigs();
  }
}
