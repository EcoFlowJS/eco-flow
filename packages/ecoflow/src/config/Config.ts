/*!
 * Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import { configSettings } from "@eco-flow/types";
import path from "path";
import fs from "fs";
import { homedir } from "os";
import { glob } from "glob";
import defaultConfig from "./default.config";

/**
 * Configuration for the application environment that will be used to configure the application environment
 * for the application component that will be used to run the application.
 * @param Directory The directory where the application will save the configuration files.
 * @param Name The name of the configuration file that will be saved.
 */
export class Config {
  private defaultConfig: configSettings;
  private configDir =
    process.env.configDir || homedir().replace(/\\/g, "/") + "/.ecoflow/config";
  private configFile = path.join(this.configDir, "ecoflow.json");
  private config!: configSettings;

  constructor(Directory?: string, Name?: string) {
    if (
      typeof Directory !== "undefined" &&
      fs.existsSync(Directory) &&
      fs.lstatSync(Directory).isDirectory()
    )
      this.configDir = Directory;

    if (typeof Name !== "undefined") {
      Name = Name + ".json";
      this.configFile = path.join(this.configDir, Name);
    }

    this.defaultConfig = defaultConfig;
    this.initConfig().loadConfig();
    return this;
  }

  /**
   * Initializes the Global Instance of the Config object with empty configuration settings.
   * @memberof Config
   */
  private initConfig(): Config {
    if (typeof global.ecoFlow === "undefined") global.ecoFlow = {};

    if (typeof global.ecoFlow.config === "undefined")
      global.ecoFlow.config = {};
    return this;
  }

  /**
   * Load the config file and if notg it exists in the config directory then load default config.
   * @memberof Config
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
  private saveConfig(cfg: configSettings = this.config): void {
    fs.writeFileSync(this.configFile, JSON.stringify(cfg, null, 2), {
      encoding: "utf8",
    });
  }

  /**
   * Create the Base or Default Configuration file in the configutation directory.
   * @memberof Config
   */
  private createConfigFile(): void {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });

      this.saveConfig();
    }
  }

  /**
   * Configuration Settings to up updated.
   * @memberof Config
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
   * Returns the configuration object for a given key. If the configuration object is present it will be returned else will be undefined.
   * @memberof Config
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
   * Configuration Settings to save or update to the config file in the config directory.
   * @memberof Config
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
   * @memberof Config
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
   * @memberof Config
   * @param ConfigFileName Name of the backuped Configuration to be deleted.
   * @returns Array of backup configurations names.
   */
  async deleteConfigFile(ConfigFileName: string): Promise<string[]> {
    if (fs.existsSync(this.configDir + "/" + ConfigFileName))
      fs.unlinkSync(this.configDir + "/" + ConfigFileName);
    return await this.listBackupConfigs();
  }
}
