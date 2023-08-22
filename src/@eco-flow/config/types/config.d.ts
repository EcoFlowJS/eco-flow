import { NextFunction } from "@types/express";
import { configSettings } from "@eco-flow/config";

/**
 * Configuration for the application environment that will be used to configure the application environment 
 * for the application component that will be used to run the application.
 */
export class Config {
  /**
   * Returns the configuration object for a given key. If the configuration object is present it will be returned else will be undefined.
   * @param key string name of the configuration.
   * @returns object or string containing configuration information.
   */
  get(key: string): unknown;

  /**
   * Configuration Settings to save or update to the config file in the config directory.
   * @param cfg Configuration Settings to up stored or update.
   * @returns object or string containing all configuration information.
   */
  setConfig(config: configSettings): configSettings;

  /**
   * List all the available backup configs availabe.
   * @returns Array of backup configurations names.
   */
  listBackupConfigs(): Promise<string[]>;

  /**
   * Delete the backup config file if it exists and returns list of backup configurations present in the config directory.
   * @param ConfigFileName Name of the backuped Configuration to be deleted.
   * @returns Array of backup configurations names.
   */
  deleteConfigFile(ConfigFileName: string): Promise<string[]>;
}
