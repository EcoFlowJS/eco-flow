import { ILoggingConfig } from "../../utils";

export interface ICommand {
  Host?: string;
  Port?: number;
  auth?: boolean;
  configDir?: string;
  configName?: string;
  userDir?: string;
  logging?: ILoggingConfig;
}
