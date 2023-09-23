/*!
 * Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import winston, { createLogger, format, transports } from "winston";
const { combine, timestamp, label, prettyPrint, printf, colorize } = format;
import { configSettings } from "@eco-flow/config";
import {
  ILoggingConfig,
  ILoggingDefaultConfig,
  LogLevel,
} from "./logger.interface";
import { homedir } from "os";
import fs from "fs";
import { LogLevelName } from "./logger.const";

/**
 * Default configuration for logging output. This configuration is used by the logging
 * subsystem to configure logging configuration for the application level logging subsystem
 * and provides a default configuration for the application level logging subsystem.
 */
const defaultConfig: ILoggingDefaultConfig = {
  enabled: true,
  level: LogLevel.INFO,
  format: "`[ ${timestamp} ] : [ ${label} ] | [ ${level} ] : ${message}`",
  prettyPrint: false,
  lable: {
    enable: false,
    lable: "EcoFlow Logger",
  },
  console: false,
  file: {
    enabled: false,
    location:
      process.env.loggerDir || homedir().replace(/\\/g, "/") + "/.ecoflow/logs",
    filename: ((): string => {
      const date = new Date();
      return (
        "ecoFlow_" +
        new Date().getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0") +
        ".log"
      );
    })(),
  },
  web: {
    enabled: false,
    host: "localhost",
    port: 3492,
    path: "/",
  },
};

/**
 * Logger for the application environment that will be used to log to the application level log output
 * for the application component that will be used to run the application.
 */
export class Logger {
  private loggerConfig!: ILoggingConfig;
  private logger!: winston.Logger;
  private isEnabled!: boolean;
  private level!: number;
  private format!: string;
  private isLable!: boolean;
  private lable!: string;
  private isConsole!: boolean;
  private isPrettyPrint!: boolean;
  private isFile!: boolean;
  private filelocation!: string;
  private fileName!: string;
  private isWeb!: boolean;
  private webHost!: string;
  private webPort!: number;
  private webPath!: string;
  private isVerbose: boolean = false;

  /**
   * Logger for the application environment that will be used to log to the application level log output
   * for the application component that will be used to run the application.
   * @memberof Logger
   * @param Configuration object containing configuration settings for logging configuration settings for this instances.
   */
  constructor({ logging }: configSettings) {
    if (typeof logging !== "undefined")
      this.loggerConfig = { ...defaultConfig, ...logging };
    this.initLogger();
  }

  /**
   * Initializes the logger configuration with the configuration settings provided in the config settings object passed to the constructor function.
   * @memberof Logger
   * @returns instance of Logger class.
   */
  private initLogger(): Logger {
    this.loadLoggerConfigurations();
    if (this.isEnabled) {
      this.logger = createLogger();
      this.configurfeLogger();
    }
    return this;
  }

  /**
   * Loads the configuration settings from the config settings object passed to the constructor function and stores them in it.
   * @memberof Logger
   * @returns instance of Logger class.
   */
  private loadLoggerConfigurations(): Logger {
    this.isEnabled = this.loggerConfig.enabled;

    this.level = this.loggerConfig.level;

    this.format =
      typeof this.loggerConfig.format === "string"
        ? this.loggerConfig.format
        : defaultConfig.format;

    this.isLable =
      typeof this.loggerConfig.lable?.enable === "boolean"
        ? this.loggerConfig.lable.enable
        : defaultConfig.lable.enable;

    this.lable =
      this.loggerConfig.lable?.enable === true &&
      typeof this.loggerConfig.lable.lable === "string"
        ? this.loggerConfig.lable.lable
        : defaultConfig.lable.lable;

    this.isConsole =
      typeof this.loggerConfig.console !== "undefined"
        ? this.loggerConfig.console
        : defaultConfig.console;

    this.isPrettyPrint =
      typeof this.loggerConfig.prettyPrint !== "undefined"
        ? this.loggerConfig.prettyPrint
        : defaultConfig.prettyPrint;

    this.isFile =
      typeof this.loggerConfig.file !== "undefined"
        ? this.loggerConfig.file.enabled
        : defaultConfig.file.enabled;

    this.filelocation =
      this.loggerConfig.file?.enabled === true &&
      typeof this.loggerConfig.file.location !== "undefined"
        ? this.loggerConfig.file.location
        : defaultConfig.file.location;

    this.fileName =
      this.loggerConfig.file?.enabled === true &&
      typeof this.loggerConfig.file.filename !== "undefined"
        ? this.loggerConfig.file.filename
        : defaultConfig.file.filename;

    this.isWeb =
      typeof this.loggerConfig.web !== "undefined"
        ? this.loggerConfig.web.enabled
        : defaultConfig.web.enabled;

    this.webHost =
      this.loggerConfig.web?.enabled === true &&
      typeof this.loggerConfig.web.host === "string"
        ? typeof this.loggerConfig.web.host
        : defaultConfig.web.host;

    this.webPort =
      this.loggerConfig.web?.enabled === true &&
      typeof this.loggerConfig.web.port === "number"
        ? this.loggerConfig.web.port
        : defaultConfig.web.port;

    this.webPath =
      this.loggerConfig.web?.enabled === true &&
      typeof this.loggerConfig.web.path === "string"
        ? typeof this.loggerConfig.web.path
        : defaultConfig.web.path;

    return this;
  }

  /**
   * Configures the Logger interface with the specified configuration object.
   * @memberof Logger
   * @returns instance of Logger class.
   */
  private configurfeLogger(): Logger {
    const formatter = printf(({ level, message, label, timestamp }) => {
      message = typeof message === "string" ? message : JSON.stringify(message);
      return eval(this.format);
    });

    const level: number = this.isVerbose ? LogLevel.VERBOSE : this.level;

    this.logger.configure({
      level: LogLevelName[level],
      format: combine(
        this.isLable ? label({ label: this.lable }) : label(),
        timestamp(),
        formatter,
        this.isPrettyPrint ? prettyPrint() : label()
      ),
    });

    if (this.isConsole)
      this.logger.add(
        new transports.Console({
          format: combine(
            this.isLable ? label({ label: this.lable }) : label(),
            timestamp(),
            formatter,
            this.isPrettyPrint ? prettyPrint() : label(),
            colorize({ all: true })
          ),
        })
      );

    if (this.isFile) {
      if (!fs.existsSync(this.filelocation))
        fs.mkdirSync(this.filelocation, { recursive: true });
      this.logger.add(
        new transports.File({
          dirname: this.filelocation,
          filename: this.fileName,
        })
      );
    }

    if (this.isWeb) {
      this.logger.add(
        new transports.Http({
          host: this.webHost,
          port: this.webPort,
          path: this.webPath,
        })
      );
    }

    return this;
  }

  /**
   * Enable verbose logging for this transport instance and for all other transport instances
   * that are running in this transport instance (e.g. web app instance instances).
   * @memberof Logger
   * @param verbose {boolean} Whether to enable verbose logging for this transport instance and all other transport instances.
   * @returns instance of Logger class.
   */
  setVerbose(verbose: boolean = false): Logger {
    this.isVerbose = verbose;
    this.configurfeLogger();
    return this;
  }

  /**
   * Use this method to update the configuration of the logging configuration to the new configuration settings for the current transport instances.
   * @memberof Logger
   * @param Configuration object containing configuration settings for logging configuration settings for this instances.
   * @returns instance of Logger class.
   */
  updateConfig({ logging }: configSettings): Logger {
    if (typeof logging !== "undefined")
      this.loggerConfig = { ...defaultConfig, ...logging };

    this.loadLoggerConfigurations();
    if (this.isEnabled) {
      this.logger =
        typeof this.logger === "undefined" ? createLogger() : this.logger;
      this.configurfeLogger();
    }
    return this;
  }

  /**
   * Log to the given transport in the configuration settings for logging configuration settings for this instances.
   * @memberof Logger
   * @param message Object containing the level message to be logged by the logger instance.
   * message object contains the message to be logged by the logger instance.
   * if message does not contain level then it will be logged with the default level INFO
   * otherwise it will be logged with the given level.
   * @returns instance of Logger class.
   */
  log(message: { level?: number; message: any }): Logger {
    message.level =
      typeof message.level !== "undefined" ? message.level : this.level;
    this.logger.log(LogLevelName[message.level], message);
    return this;
  }

  /**
   * Logs a message to the logger at ERROR level.
   * @memberof Logger
   * @param message contsa the message to be logged by the logger instance.
   * @returns instance of Logger class.
   */
  error(message: any): Logger {
    this.log({ level: LogLevel.ERROR, message: message });
    return this;
  }

  /**
   * Logs a message to the logger at WARN level.
   * @memberof Logger
   * @param message contsa the message to be logged by the logger instance.
   * @returns instance of Logger class.
   */
  warn(message: any): Logger {
    this.log({ level: LogLevel.WARNING, message: message });
    return this;
  }

  /**
   * Logs a message to the logger at INFO level.
   * @memberof Logger
   * @param message contsa the message to be logged by the logger instance.
   * @returns instance of Logger class.
   */
  info(message: any): Logger {
    this.log({ level: LogLevel.INFO, message: message });
    return this;
  }

  /**
   * Logs a message to the logger at VERBSOE level.
   * @memberof Logger
   * @param message contsa the message to be logged by the logger instance.
   * @returns instance of Logger class.
   */
  verbose(message: any): Logger {
    this.log({ level: LogLevel.VERBOSE, message: message });
    return this;
  }

  /**
   * Logs a message to the logger at DEBUG level.
   * @memberof Logger
   * @param message contsa the message to be logged by the logger instance.
   * @returns instance of Logger class.
   */
  debug(message: any): Logger {
    this.log({ level: LogLevel.DEBUG, message: message });
    return this;
  }
}
