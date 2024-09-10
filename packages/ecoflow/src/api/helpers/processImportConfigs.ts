import path from "path";
import fse from "fs-extra";
import { configOptions } from "@ecoflow/types";
import Helper from "@ecoflow/helper";
import defaultConfig from "../../config/default.config.js";

const processImportConfigs = async (
  extractDirectory: string
): Promise<[boolean, string]> => {
  const { _, database, config } = ecoFlow;

  if (!(await fse.exists(path.join(extractDirectory, "configs.json")))) {
    fse.remove(extractDirectory);
    return [false, "Server configuration not found."];
  }

  const configs: configOptions = Helper.requireUncached(
    path.join(extractDirectory, "configs.json")
  );

  if (_.isUndefined(configs.database))
    configs.database = defaultConfig.database;

  if (
    !database.validateConnection(
      configs.database.driver,
      configs.database.configuration
    )
  ) {
    fse.remove(extractDirectory);
    return [
      false,
      "System database connection failed. Recheck database connections",
    ];
  }

  configs.userDir = defaultConfig.userDir;
  configs.moduleDir = defaultConfig.moduleDir;
  configs.flowDir = defaultConfig.flowDir;
  configs.envDir = defaultConfig.envDir;
  configs.DB_Directory = defaultConfig.DB_Directory;
  configs.httpStaticRoot = defaultConfig.httpStaticRoot;

  await config.setConfig(configs);

  return [true, "Config updated successfully."];
};

export default processImportConfigs;
