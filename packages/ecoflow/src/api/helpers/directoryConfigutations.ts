import path from "path";
import fse from "fs-extra";
import { configOptions } from "@ecoflow/types";

// Directory Configutations
const directoryConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const { userDir, moduleDir, flowDir, envDir, DB_Directory, httpStaticRoot } =
    configRequest;

  if (!_.isUndefined(userDir) && !_.isEmpty(userDir)) {
    if (
      !(await fse.exists(userDir)) ||
      !(await fse.lstat(userDir)).isDirectory()
    )
      throw "Given user directory is either not a directory or does not exist!!";
    configs.userDir = path.join(userDir).replace(/\\/g, "/");
  }

  if (!_.isUndefined(moduleDir) && !_.isEmpty(moduleDir)) {
    if (
      !(await fse.exists(moduleDir)) ||
      !(await fse.lstat(moduleDir)).isDirectory()
    )
      throw "Given module directory is either not a directory or does not exist!!";
    configs.moduleDir = path.join(moduleDir).replace(/\\/g, "/");
  }

  if (!_.isUndefined(flowDir) && !_.isEmpty(flowDir)) {
    await fse.ensureDir(flowDir);
    if (
      !(await fse.exists(flowDir)) ||
      !(await fse.lstat(flowDir)).isDirectory()
    )
      throw "Given module directory is either not a directory or does not exist!!";
    configs.flowDir = path.join(flowDir).replace(/\\/g, "/");
  }

  if (!_.isUndefined(envDir) && !_.isEmpty(envDir)) {
    if (!(await fse.exists(envDir)) || !(await fse.lstat(envDir)).isDirectory())
      throw "Given environment  directory is either not a directory or does not exist!!";
    configs.envDir = path.join(envDir).replace(/\\/g, "/");
  }

  if (!_.isUndefined(DB_Directory) && !_.isEmpty(DB_Directory)) {
    if (
      !(await fse.exists(DB_Directory)) ||
      !(await fse.lstat(DB_Directory)).isDirectory()
    )
      throw "Given databse directory is either not a directory or does not exist!!";
    configs.DB_Directory = path.join(DB_Directory).replace(/\\/g, "/");
  }

  if (!_.isUndefined(httpStaticRoot) && !_.isEmpty(httpStaticRoot)) {
    if (
      !(await fse.exists(httpStaticRoot)) ||
      !(await fse.lstat(httpStaticRoot)).isDirectory()
    )
      throw "Given static serve directory is either not a directory or does not exist!!";
    configs.httpStaticRoot = path.join(httpStaticRoot).replace(/\\/g, "/");
  }

  return configs;
};

export default directoryConfigutations;
