import path from "path";
import fse from "fs-extra";
import dotenv from "dotenv";
import { homedir } from "os";

/**
 * Loads the environment variables from the specified directories and files.
 * If the environment directory is not specified, it defaults to a directory in the user's home directory.
 * @returns None
 */
const loadEnvironments = () => {
  const { _, config } = ecoFlow;
  const envDir = _.isEmpty(config.get("envDir"))
    ? process.env.configDir ||
      homedir().replace(/\\/g, "/") + "/.ecoflow/environment"
    : fse.existsSync(config.get("envDir"))
    ? fse.lstatSync(config.get("envDir")).isDirectory()
      ? config.get("envDir")
      : process.env.configDir ||
        homedir().replace(/\\/g, "/") + "/.ecoflow/environment"
    : fse.ensureDirSync(config.get("envDir"));

  const ecosystemEnv = path.join(envDir!, "/ecoflow.environments.env");
  const userEnv = path.join(envDir!, "/user.environments.env");
  fse.ensureFileSync(ecosystemEnv);
  fse.ensureFileSync(userEnv);

  // //Admin Panel EnvSettings
  // fse.writeFileSync(
  //   path.join(
  //     path.dirname(
  //       path.dirname(path.dirname(path.dirname(path.dirname(__filename))))
  //     ),
  //     "editors",
  //     "admin-panel",
  //     ".env"
  //   ),
  //   `VITE_CLIENT_API_ENDPOINT=${server.baseUrl}${
  //     config.get("systemRouterOptions").prefix
  //   }`,
  //   "utf8"
  // );

  // //Base Panel EnvSettings
  // fse.writeFileSync(
  //   path.join(
  //     path.dirname(
  //       path.dirname(path.dirname(path.dirname(path.dirname(__filename))))
  //     ),
  //     "editors",
  //     "base-panel",
  //     ".env"
  //   ),
  //   `VITE_CLIENT_API_ENDPOINT=${server.baseUrl}${
  //     config.get("systemRouterOptions").prefix
  //   }`,
  //   "utf8"
  // );

  // //Flow Panel EnvSettings
  // fse.writeFileSync(
  //   path.join(
  //     path.dirname(
  //       path.dirname(path.dirname(path.dirname(path.dirname(__filename))))
  //     ),
  //     "editors",
  //     "flow-editor",
  //     ".env"
  //   ),
  //   `VITE_CLIENT_API_ENDPOINT=${server.baseUrl}${
  //     config.get("systemRouterOptions").prefix
  //   }`,
  //   "utf8"
  // );

  // //Schema Panel EnvSettings
  // fse.writeFileSync(
  //   path.join(
  //     path.dirname(
  //       path.dirname(path.dirname(path.dirname(path.dirname(__filename))))
  //     ),
  //     "editors",
  //     "schema-editor",
  //     ".env"
  //   ),
  //   `VITE_CLIENT_API_ENDPOINT=${server.baseUrl}${
  //     config.get("systemRouterOptions").prefix
  //   }`,
  //   "utf8"
  // );

  //import environments
  dotenv.config({ path: ecosystemEnv });
  dotenv.config({ path: userEnv });
};

export default loadEnvironments;
