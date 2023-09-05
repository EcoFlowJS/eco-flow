import { Config } from "./config";
import { LogLevel } from "./interfaces/logger.interface";
import { Logger } from "./utils/Logger";

new Config();
let alog = new Logger(ecoFlow.config);
alog.info({ abstract: false });
