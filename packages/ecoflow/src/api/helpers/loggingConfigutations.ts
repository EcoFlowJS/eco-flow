import path from "path";
import fse from "fs-extra";
import { configOptions } from "@ecoflow/types";

// Logging Configutations
const loggingConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const {
    loggingEnabled,
    loggingLevel,
    loggingFormat,
    loggingPrettyPrint,
    loggingLableEnable,
    loggingLableLable,
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
        !_.isUndefined(loggingLableEnable) &&
        _.isBoolean(loggingLableEnable)
      ) {
        configs.logging!.lable = Object.create({});
        if (loggingLableEnable) {
          configs.logging!.lable!.enable = true;
          if (
            !_.isUndefined(loggingLableLable) &&
            !_.isEmpty(loggingLableLable)
          )
            configs.logging!.lable!.lable = loggingLableLable;
        } else configs.logging!.lable!.enable = false;
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
            throw "Logging File Directoty does not exist or is not a directory.";
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

export default loggingConfigutations;
