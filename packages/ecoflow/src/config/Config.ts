import path from "path";
import fse from "fs-extra";
import { glob } from "glob";
import { homedir } from "os";
import { merge } from "lodash";
import defaultConfig from "./default.config";
import { configSettings, Config as IConfig } from "@eco-flow/types";

/**
 * Configuration for the application environment that will be used to configure the application environment
 * for the application component that will be used to run the application.
 * @param Directory The directory where the application will save the configuration files.
 * @param Name The name of the configuration file that will be saved.
 */
export class Config implements IConfig {
  private configDir =
    process.env.configDir || homedir().replace(/\\/g, "/") + "/.ecoflow/config";
  private configFile = path.join(this.configDir, "ecoflow.json");

  //Global configuration settings of the application.
  _config: configSettings = {};

  constructor(Directory?: string, Name?: string, tempConfig?: configSettings) {
    if (
      typeof Directory !== "undefined" &&
      fse.existsSync(Directory) &&
      fse.lstatSync(Directory).isDirectory()
    )
      this.configDir = Directory;

    if (typeof Name !== "undefined") {
      Name = Name + ".json";
      this.configFile = path.join(this.configDir, Name);
    }

    this.loadConfig();
    if (typeof tempConfig !== "undefined") this.tempConfigUpdate(tempConfig);
    return this;
  }

  /**
   * Update the configuration of the application based on the temporary configuration.
   * @param tempConfig temporary configuration options object containing the configuration settings to update the configuration.
   */
  private tempConfigUpdate(tempConfig: configSettings) {
    merge(this._config, tempConfig);
  }

  /**
   * Load the config file and if notg it exists in the config directory then load default config.
   * @memberof Config
   */
  private loadConfig(): void {
    if (!fse.existsSync(this.configFile)) {
      this.saveConfig(defaultConfig);
    }
    let config = {
      ...require(this.configFile),
    };

    this._config = config;
  }

  /**
   * Extract the configuration from from the config object and return it as a string.
   * @memberof Config
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
   * Save the configuration object to the configuration directory.
   * @memberof Config
   * @param cfg Configuration information to be stored in the config.
   */
  private saveConfig(cfg: configSettings = this._config): void {
    fse.writeFileSync(this.configFile, JSON.stringify(cfg, null, 2), {
      encoding: "utf8",
    });
  }

  /**
   * Create the Base or Default Configuration file in the configutation directory.
   * @memberof Config
   */
  private async createConfigFile(): Promise<void> {
    await fse.ensureDir(this.configDir);
    this.saveConfig();
  }

  /**
   * Configuration Settings to up updated.
   * @memberof Config
   * @param cfg Configuration information to be updated in the config file in the config directory.
   */
  private async updateConfigFile(cfg: configSettings): Promise<void> {
    if (await fse.exists(this.configFile)) {
      const backupConfigPath = path.join(
        this.configDir,
        "backup_" + new Date().getTime() + ".json"
      );
      await fse.copyFile(this.configFile, backupConfigPath);
    }
    this.saveConfig(cfg);
  }

  /**
   * Returns the configuration object for a given key. If the configuration object is present it will be returned else will be undefined.
   * @memberof Config
   * @param key string name of the configuration.
   * @returns {Object | String} containing configuration information.
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
    let config: configSettings = this._config;
    return this.getConfig({ config }, key, true);
  }

  /**
   * Configuration Settings to save or update to the config file in the config directory.
   * @memberof Config
   * @param cfg Configuration Settings to up stored or update.
   * @returns {Promise<configSettings>} Promise resolving all configuration information.
   */
  async setConfig(cfg: configSettings): Promise<configSettings> {
    if (!(await fse.exists(this.configFile))) await this.createConfigFile();

    const updatedConfig: configSettings = {
      ...this._config,
      ...cfg,
    };

    await this.updateConfigFile(updatedConfig);

    return updatedConfig;
  }

  /**
   * List all the available backup configs availabe.
   * @memberof Config
   * @returns {Promise<string[]>} Promise resolving array containing names of backup configurations files.
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
   * @memberof Config
   * @param ConfigFileName Name of the backuped Configuration to be deleted.
   * @returns {Promise<string[]> } Promise resolving array containing names of backup configurations files.
   */
  async deleteConfigFile(ConfigFileName: string): Promise<string[]> {
    ConfigFileName = !ConfigFileName.endsWith(".json")
      ? ConfigFileName + ".json"
      : ConfigFileName;

    if (await fse.exists(this.configDir + "/" + ConfigFileName))
      await fse.unlink(this.configDir + "/" + ConfigFileName);
    return await this.listBackupConfigs();
  }
}
