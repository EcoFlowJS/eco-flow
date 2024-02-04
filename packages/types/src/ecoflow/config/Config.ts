import { configOptions } from "./config.default";

export interface Config {
  //Global configuration settings of the application.
  _config: configOptions;

  get getConfigPath(): string;

  get getConfigFileName(): string;

  /**
   * Returns the Default configuration settings
   * @returns {configOptions} containing default configuration information.
   */
  getDefaultConfigs(): configOptions;

  /**
   * Returns the configuration object for a given key. If the configuration object is present it will be returned else will be undefined.
   * @memberof Config
   * @param key string name of the configuration.
   * @returns {Object | String} containing configuration information.
   */
  get(key: string): any;

  /**
   * Configuration Settings to save or update to the config file in the config directory.
   * @memberof Config
   * @param cfg Configuration Settings to up stored or update.
   * @returns {Promise<configOptions>} Promise resolving all configuration information.
   */
  setConfig(cfg: configOptions): Promise<configOptions>;

  createBackup(): Promise<void>;

  /**
   * List all the available backup configs availabe.
   * @memberof Config
   * @returns {Promise<string[]>} Promise resolving array containing names of backup configurations files.
   */
  listBackupConfigs(): Promise<string[]>;

  /**
   * Delete the backup config file if it exists and returns list of backup configurations present in the config directory.
   * @memberof Config
   * @param ConfigFileName Name of the backuped Configuration to be deleted.
   * @returns {Promise<string[]> } Promise resolving array containing names of backup configurations files.
   */
  deleteConfigFile(ConfigFileName: string): Promise<string[]>;
}
