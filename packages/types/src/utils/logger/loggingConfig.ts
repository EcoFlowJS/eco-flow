/**
 * This type defines options for a logger with various configuration settings.
 * @property {boolean} enabled - The `enabled` property in the `loggerOptions` type specifies whether
 * the logging functionality is enabled or not. It is a boolean value, where `true` means logging is
 * enabled and `false` means logging is disabled.
 * @property {number} level - The `level` property in the `loggerOptions` type specifies the logging
 * level, which indicates the severity of the log message.
 *   Level         value
 *   ERROR           0
 *   WARNING         1
 *   INFO            2
 *   VERBOSE         4
 *   DEBUG           5
 * @property {string} format - The `format` property in the `loggerOptions` type specifies the format
 * in which the log messages will be displayed or stored. It is an optional property, meaning it does
 * not have to be provided when creating a `loggerOptions` object. If provided, it would typically
 * contain a string that defines.
 * @default format `[ ${timestamp} ] : [ ${label} ] | [ ${level} ] : ${message}`
 * @property {boolean} prettyPrint - The `prettyPrint` property in the `loggerOptions` type specifies
 * whether the log messages should be formatted in indented way for better readability.
 * If `prettyPrint` is set to `true`, the log messages will be formatted nicely.
 * If it's set to `false`
 * @default prettyPrint is `false`
 * @property {object} lable - The `lable` property in the `loggerOptions` type is defining an object
 * with two properties:
 *    1. `enable`: A boolean value that specifies whether this feature is enabled or not.
 *    2. `lable`: An optional string property that can hold a label value.
 * @property {boolean} console - The `console` property in the `loggerOptions` type specifies whether
 * logging to the console is enabled. If `console` is set to `true`, log messages will be output to the
 * console. If it's set to `false`, log messages will not be displayed on the console.
 * @property {object} file - The `file` property in the `loggerOptions` type represents options related to
 * logging to a file. It includes the following sub-properties:
 *    1. `enable`: A boolean value that specifies whether this feature is enabled or not.
 *    2. `location`: An optional string property that defines the location of log folder.
 *    3. `filename`: An optional string property that specifies the name of the log file.
 * @property {web} web - The `web` property in the `loggerOptions` type represents the configuration options
 * for logging to a web server. It includes the following sub-properties:
 */
export type loggerOptions = {
  /**
   *  The `enabled` property in the `loggerOptions` type specifies whether
   * the logging functionality is enabled or not. It is a boolean value, where `true` means logging is
   * enabled and `false` means logging is disabled.
   */
  enabled: boolean;
  /**
   * The `level` property in the `loggerOptions` type specifies the logging
   * level, which indicates the severity of the log message.
   *   Level         value
   *   ERROR           0
   *   WARNING         1
   *   INFO            2
   *   VERBOSE         4
   *   DEBUG           5
   */
  level: number;
  /**
   * The `format` property in the `loggerOptions` type specifies the format
   * in which the log messages will be displayed or stored. It is an optional property, meaning it does
   * not have to be provided when creating a `loggerOptions` object. If provided, it would typically
   * contain a string that defines.
   * @default format `[ ${timestamp} ] : [ ${label} ] | [ ${level} ] : ${message}`
   */
  format?: string;
  /**
   * The `prettyPrint` property in the `loggerOptions` type specifies
   * whether the log messages should be formatted in indented way for better readability.
   * If `prettyPrint` is set to `true`, the log messages will be formatted nicely.
   * If it's set to `false`
   * @default prettyPrint is `false` */
  prettyPrint?: boolean;
  /**
   * The `lable` property in the `loggerOptions` type is defining an object with two properties:
   * 1. `enable`: A boolean value that specifies whether this feature is enabled or not.
   * 2. `lable`: An optional string property that can hold a label value.
   */
  lable?: {
    enable: boolean;
    lable?: string;
  };
  /**
   * The `console` property in the `loggerOptions` type specifies whether
   * logging to the console is enabled. If `console` is set to `true`, log messages will be output to the
   * console. If it's set to `false`, log messages will not be displayed on the console.
   */
  console?: boolean;
  /**
   * The `file` property in the `loggerOptions` type is defining options related to logging to a file.
   * Within the `file` property, there are sub-properties specified as follows:
   * 1. `enable`: A boolean value that specifies whether this feature is enabled or not.
   * 2. `location`: An optional string property that defines the location of log folder.
   * 3. `filename`: An optional string property that specifies the name of the log file.
   */
  file?: {
    enabled: boolean;
    location?: string;
    filename?: string;
  };
  web?: {
    enabled: boolean;
    host?: string;
    port?: number;
    path?: string;
  };
};
