import { configSettings } from "./configSttings";

export interface Config {
  _config: configSettings;
  get(key: string): any;
  setConfig(cfg: configSettings): configSettings;
  listBackupConfigs(): Promise<string[]>;
  deleteConfigFile(ConfigFileName: string): Promise<string[]>;
}
