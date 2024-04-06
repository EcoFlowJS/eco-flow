import path from "path";
import fse from "fs-extra";
import { glob } from "glob";
import { homedir } from "os";
import { merge } from "lodash";
import defaultConfig from "./default.config";
import { configOptions, Config as IConfig } from "@ecoflow/types";

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
  _config: configOptions = {};

  constructor(Directory?: string, Name?: string, tempConfig?: configOptions) {
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
  private tempConfigUpdate(tempConfig: configOptions) {
    merge(this._config, tempConfig);
  }

  /**
   * Load the config file and if notg it exists in the config directory then load default config.
   * @memberof Config
   */
  private loadConfig(): void {
    if (!fse.existsSync(this.configFile)) {
      this.createDefaultConfigFile();
    }
    let config = {
      ...JSON.parse(fse.readFileSync(this.configFile, "utf8")),
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
  private async saveConfig(cfg: configOptions = this._config): Promise<void> {
    const { log } = ecoFlow;

    await fse.ensureDir(this.configDir);
    log.info("Writing new configuration ");
    await fse.writeFile(this.configFile, JSON.stringify(cfg, null, 2), {
      encoding: "utf8",
    });
  }

  /**
   * Create the Base or Default Configuration file in the configutation directory.
   * @memberof Config
   */
  private createDefaultConfigFile(): void {
    if (!fse.existsSync(this.configFile)) {
      fse.ensureDirSync(this.configDir);
      fse.writeFileSync(
        this.configFile,
        JSON.stringify(defaultConfig, null, 2),
        {
          encoding: "utf8",
        }
      );
    }
  }

  /**
   * Configuration Settings to up updated.
   * @memberof Config
   * @param cfg Configuration information to be updated in the config file in the config directory.
   */
  private async updateConfigFile(cfg: configOptions): Promise<void> {
    const { log } = ecoFlow;
    if (await fse.exists(this.configFile)) {
      await this.createBackup();
    } else
      log.info("Config file not found at : " + path.dirname(this.configFile));
    await this.saveConfig(cfg);
  }

  get getConfigPath(): string {
    return path.dirname(this.configFile);
  }

  get getConfigFileName(): string {
    return path.basename(this.configFile);
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
    let config: configOptions = this._config;
    return this.getConfig({ config }, key, true);
  }

  /**
   * Configuration Settings to save or update to the config file in the config directory.
   * @memberof Config
   * @param cfg Configuration Settings to up stored or update.
   * @returns {Promise<configSettings>} Promise resolving all configuration information.
   */
  async setConfig(cfg: configOptions): Promise<configOptions> {
    const { flowEditor } = ecoFlow;
    const oldConfigs = {
      ...defaultConfig,
      ...this._config,
    };
    this._config = {
      ...defaultConfig,
      ...this._config,
      ...cfg,
    };

    await this.updateConfigFile(this._config);
    if (oldConfigs.flowDir !== this._config.flowDir)
      await fse.copy(oldConfigs.flowDir!, this._config.flowDir!);

    await flowEditor.updateFlowConfigs({
      flowDir: this._config.flowDir || defaultConfig.flowDir!,
      flowFilePretty:
        this._config.flowFilePretty || defaultConfig.flowFilePretty!,
    });

    if (
      oldConfigs.flowNodeConfigurations !==
        this._config.flowNodeConfigurations ||
      oldConfigs.flowNodeConnections !== this._config.flowNodeConnections ||
      oldConfigs.flowNodeDefinitions !== this._config.flowNodeDefinitions
    )
      await flowEditor.updateFlowConfigs(
        {
          flowNodeConfigurations:
            oldConfigs.flowNodeConfigurations ||
            defaultConfig.flowNodeConfigurations!,
          flowNodeConnections:
            oldConfigs.flowNodeConnections ||
            defaultConfig.flowNodeConnections!,
          flowNodeDefinitions:
            oldConfigs.flowNodeDefinitions ||
            defaultConfig.flowNodeDefinitions!,
        },
        {
          flowNodeConfigurations: this._config.flowNodeConfigurations!,
          flowNodeConnections: this._config.flowNodeConnections!,
          flowNodeDefinitions: this._config.flowNodeDefinitions!,
        }
      );
    return this._config;
  }

  async createBackup(): Promise<void> {
    const { log } = ecoFlow;

    const currentDate = `${new Date()
      .toLocaleDateString()
      .replace(/\//gi, "-")}.${new Date()
      .toLocaleTimeString()
      .replace(/(:| )/gi, "-")}`;
    const configPath = this.getConfigPath;
    const fileName = `backup_${currentDate}.json`;

    log.info("Backing up configuration at : " + configPath);
    await fse.copyFile(this.configFile, path.join(configPath, fileName));
    log.info("Backed up configuration at : " + path.join(configPath, fileName));
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

  /**
   * Returns the Default configuration settings
   * @returns {configOptions} containing default configuration information.
   */
  getDefaultConfigs(): configOptions {
    return defaultConfig;
  }
}
