import { configSettings } from "../../interfaces/config.interface";
import path from "path";
import fs from "fs";
import { homedir } from "os";
import { glob } from "glob";
import defaultConfig from "./default.config";

/**
 * Configuration for the application environment that will be used to configure the application environment
 * for the application component that will be used to run the application.
 */
export class Config {
  private defaultConfig: configSettings;
  private configDir =
    process.env.configDir || homedir().replace(/\\/g, "/") + "/.ecoflow/config";
  private configFile = path.join(this.configDir, "ecoflow.json");
  private config!: configSettings;
  constructor() {
    this.defaultConfig = defaultConfig;
    this.initConfig().loadConfig();
    return this;
  }

  /**
   * Initializes the Global Instance of the Config object with empty configuration settings.
   */
  private initConfig(): Config {
    if (typeof global.ecoFlow === "undefined") global.ecoFlow = {};

    if (typeof global.ecoFlow.config === "undefined")
      global.ecoFlow.config = {};
    return this;
  }

  /**
   * Load the config file and if notg it exists in the config directory then load default config.
   */
  private loadConfig(): void {
    let config = this.defaultConfig;
    if (fs.existsSync(this.configFile)) config = require(this.configFile);
    config = {
      ...this.defaultConfig,
      ...config,
    };

    global.ecoFlow.config = config;

    this.config = global.ecoFlow.config;
  }

  /**
   * @param object object containing configuration information.
   * @param key name of the configuration object.
   * @param isTypedArray boolean indicating if the configuration object is encoded as a typed array.
   * @returns object or string containing configuration information.
   */
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

  /**
   * Returns the configuration object for a given key. If the configuration object is present it will be returned else will be undefined.
   * @param key string name of the configuration.
   * @returns object or string containing configuration information.
   */
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
    let config: configSettings = this.config;
    return this.getConfig({ config }, key, true);
  }

  /**
   * Save the configuration object to the configuration directory.
   * @param cfg Configuration information to be stored in the config.
   */
  private saveConfig(cfg: configSettings = this.config): void {
    fs.writeFileSync(this.configFile, JSON.stringify(cfg, null, 2), {
      encoding: "utf8",
    });
  }

  /**
   * Create the Base or Default Configuration file in the configutation directory.
   */
  private createConfigFile(): void {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });

      this.saveConfig();
    }
  }

  /**
   * Configuration Settings to up updated.
   * @param cfg Configuration information to be updated in the config file in the config directory.
   */
  private updateConfigFile(cfg: configSettings): void {
    if (fs.existsSync(this.configFile)) {
      const backupConfigPath = path.join(
        this.configDir,
        "backup_" + new Date().getTime() + ".json"
      );
      fs.renameSync(this.configFile, backupConfigPath);
    }
    this.saveConfig(cfg);
  }

  /**
   * Configuration Settings to save or update to the config file in the config directory.
   * @param cfg Configuration Settings to up stored or update.
   * @returns object or string containing all configuration information.
   */
  setConfig(cfg: configSettings): configSettings {
    if (!fs.existsSync(this.configFile)) this.createConfigFile();

    const updatedConfig: configSettings = {
      ...this.defaultConfig,
      ...this.config,
      ...cfg,
    };

    this.updateConfigFile(updatedConfig);

    return updatedConfig;
  }

  /**
   * List all the available backup configs availabe.
   * @returns Array of backup configurations names.
   */
  async listBackupConfigs(): Promise<string[]> {
    return (await glob(this.configDir + "/backup_*.json")).map((file) => {
      const filePathSplit = file.split(/\\/g);
      const length = filePathSplit.length;
      return filePathSplit[length - 1];
    });
  }

  /**
   * Delete the backup config file if it exists and returns list of backup configurations present in the config directory.
   * @param ConfigFileName Name of the backuped Configuration to be deleted.
   * @returns Array of backup configurations names.
   */
  async deleteConfigFile(ConfigFileName: string): Promise<string[]> {
    if (fs.existsSync(this.configDir + "/" + ConfigFileName))
      fs.unlinkSync(this.configDir + "/" + ConfigFileName);
    return await this.listBackupConfigs();
  }
}
