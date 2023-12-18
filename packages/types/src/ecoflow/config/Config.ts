import { configSettings } from "./configSttings";

export interface Config {
  //Global configuration settings of the application.
  _config: configSettings;

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
   * @returns {Promise<configSettings>} Promise resolving all configuration information.
   */
  setConfig(cfg: configSettings): Promise<configSettings>;

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
