import { configSettings } from "../config";

export interface ICommand extends configSettings {
  auth?: boolean;
  configDir?: string;
  configName?: string;
}
