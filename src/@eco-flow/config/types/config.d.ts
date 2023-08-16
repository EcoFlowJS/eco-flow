import { NextFunction } from "@types/express";
import { configSettings } from "@eco-flow/config";

export class Config {
  get(key: string): unknown;
  setConfig(config: configSettings): configSettings;
  listBackupConfigs(): Promise<string[]>;
  deleteConfigFile(ConfigFileName: string): Promise<string[]>;
}
