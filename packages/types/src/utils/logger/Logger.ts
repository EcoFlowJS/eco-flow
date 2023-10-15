import { configSettings } from "../../ecoflow";

export interface Logger {
  setVerbose(verbose?: boolean): Logger;
  updateConfig({ logging }: configSettings): Logger;
  log(message: { level?: number; message: any }): Logger;
  error(message: any): Logger;
  warn(message: any): Logger;
  info(message: any): Logger;
  verbose(message: any): Logger;
  debug(message: any): Logger;
}
