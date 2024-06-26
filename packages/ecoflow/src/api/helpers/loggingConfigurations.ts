import path from "path";
import fse from "fs-extra";
import { configOptions } from "@ecoflow/types";

/**
 * Parses the logging configuration options from the provided configRequest object
 * and returns a configOptions object with the parsed values.
 * @param {any} configRequest - The configuration request object containing logging options.
 * @returns {Promise<configOptions>} A promise that resolves to a configOptions object with parsed logging configurations.
 */
const loggingConfigurations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const {
    loggingEnabled,
    loggingLevel,
    loggingFormat,
    loggingPrettyPrint,
    loggingLabelEnable: loggingLabelEnable,
    loggingLabelLabel,
    loggingConsole,
    loggingFileEnabled,
    loggingFileLocation,
    loggingFileFilename,
    loggingWebEnabled,
    loggingWebHost,
    loggingWebPort,
    loggingWebPath,
  } = configRequest;

  if (!_.isUndefined(loggingEnabled) && _.isBoolean(loggingEnabled)) {
    configs.logging = Object.create({});
    if (loggingEnabled) {
      configs.logging!.enabled = true;

      if (
        !_.isUndefined(loggingLevel) &&
        !_.isEmpty(loggingLevel.toString()) &&
        _.isNumber(loggingLevel)
      )
        configs.logging!.level = loggingLevel;

      if (!_.isUndefined(loggingFormat) && !_.isEmpty(loggingFormat))
        configs.logging!.format = loggingFormat;

      if (!_.isUndefined(loggingPrettyPrint) && _.isBoolean(loggingPrettyPrint))
        configs.logging!.prettyPrint = loggingPrettyPrint;

      if (
        !_.isUndefined(loggingLabelEnable) &&
        _.isBoolean(loggingLabelEnable)
      ) {
        configs.logging!.label = Object.create({});
        if (loggingLabelEnable) {
          configs.logging!.label!.enable = true;
          if (
            !_.isUndefined(loggingLabelLabel) &&
            !_.isEmpty(loggingLabelLabel)
          )
            configs.logging!.label!.label = loggingLabelLabel;
        } else configs.logging!.label!.enable = false;
      }
    } else configs.logging!.enabled = false;

    if (!_.isUndefined(loggingConsole) && _.isBoolean(loggingConsole))
      configs.logging!.console = loggingConsole;
    if (!_.isUndefined(loggingFileEnabled) && _.isBoolean(loggingFileEnabled)) {
      configs.logging!.file = Object.create({});
      if (loggingFileEnabled) {
        configs.logging!.file!.enabled = true;

        if (
          !_.isUndefined(loggingFileLocation) &&
          !_.isEmpty(loggingFileLocation)
        ) {
          if (
            !(await fse.exists(loggingFileLocation)) ||
            !(await fse.lstat(loggingFileLocation)).isDirectory()
          )
            throw "Logging File Directory does not exist or is not a directory.";
          configs.logging!.file!.location = path
            .join(loggingFileLocation)
            .replace(/\\/g, "/");
        }

        if (
          !_.isUndefined(loggingFileFilename) &&
          !_.isEmpty(loggingFileFilename)
        )
          configs.logging!.file!.filename = (<string>(
            loggingFileFilename
          )).endsWith(".log")
            ? loggingFileFilename
            : `${loggingFileFilename}.log`;
      } else configs.logging!.file!.enabled = false;
    }

    if (!_.isUndefined(loggingWebEnabled) && _.isBoolean(loggingWebEnabled)) {
      configs.logging!.web = Object.create({});
      if (loggingWebEnabled) {
        configs.logging!.web!.enabled = true;

        if (!_.isUndefined(loggingWebHost) && !_.isEmpty(loggingWebHost))
          configs.logging!.web!.host = loggingWebHost;

        if (
          !_.isUndefined(loggingWebPort) &&
          !_.isEmpty(loggingWebPort.toString()) &&
          _.isNumber(parseInt(loggingWebPort)) &&
          parseInt(loggingWebPort) !== 0
        )
          configs.logging!.web!.port = loggingWebPort;

        if (!_.isUndefined(loggingWebPath) && !_.isEmpty(loggingWebPath))
          configs.logging!.web!.host = loggingWebPath;
      } else configs.logging!.web!.enabled = false;
    }
  }

  return configs;
};

export default loggingConfigurations;
