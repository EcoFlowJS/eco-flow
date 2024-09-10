import fse from "fs-extra";
import path from "path";
import { Builder } from "@ecoflow/utils/builder";
import Helper from "@ecoflow/helper";
import { Environment } from "@ecoflow/types";
import loadEnvironments from "../../helper/env.helper.js";

const processImportEnvs = async (
  extractDirectory: string
): Promise<[boolean, string]> => {
  const { config } = ecoFlow;
  if (
    !(await fse.exists(path.join(extractDirectory, "envs.json"))) ||
    !(await fse.exists(path.join(extractDirectory, "systemEnvs.json")))
  ) {
    fse.remove(extractDirectory);
    return [false, "Server configuration not found."];
  }

  const envs: Environment[] = Helper.requireUncached(
    path.join(extractDirectory, "envs.json")
  );
  const systemEnvs: Environment[] = Helper.requireUncached(
    path.join(extractDirectory, "systemEnvs.json")
  );
  await Builder.ENV.setUserEnv(config.get("envDir"), envs, true);
  await Builder.ENV.setSystemEnv(config.get("envDir"), systemEnvs, true);
  loadEnvironments();

  return [true, "Environment variable imported correctly."];
};

export default processImportEnvs;
