import { Config } from "./config";
import { Logger } from "./utils/logger";

new Config();
let alog = new Logger(ecoFlow.config);
alog.info({ abstract: false });
