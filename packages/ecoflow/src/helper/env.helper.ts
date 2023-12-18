import _ from "lodash";
import path from "path";
import fse from "fs-extra";
import dotenv from "dotenv";
import { homedir } from "os";

export default () => {
  const envDir = _.isEmpty(ecoFlow.config._config.envDir)
    ? process.env.configDir ||
      homedir().replace(/\\/g, "/") + "/.ecoflow/environment"
    : fse.lstatSync(ecoFlow.config._config.envDir!).isDirectory()
    ? ecoFlow.config._config.envDir
    : process.env.configDir ||
      homedir().replace(/\\/g, "/") + "/.ecoflow/environment";

  const ecosystemEnv = path.join(envDir!, "/ecoflow.environments.env");
  const userEnv = path.join(envDir!, "/user.environments.env");
  fse.ensureFileSync(ecosystemEnv);
  fse.ensureFileSync(userEnv);

  //import environments
  dotenv.config({ path: ecosystemEnv });
  dotenv.config({ path: userEnv });
};
