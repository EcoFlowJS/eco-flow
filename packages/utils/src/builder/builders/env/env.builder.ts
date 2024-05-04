import path from "path";
import fse, { promises } from "fs-extra";
import _ from "lodash";
import { Environment } from "@ecoflow/types";

/* The `EnvBuilder` class provides methods for generating, updating, and managing
environment variables for system and user environments. */
export class EnvBuilder {
  /**
   * The function generates an environment variable name based on the input name and type, ensuring it
   * follows a specific format.
   * @param {string} name - The `name` parameter is a string that represents the name of an environment
   * variable.
   * @param {"SYS" | "USER"} [type=USER] - The `type` parameter in the `generateEnvName` function can
   * have two possible values: "SYS" or "USER". If no value is provided, the default value is "USER".
   * @returns The `generateEnvName` function returns a string value based on the input `name` and `type`
   * parameters. If the `type` parameter is "SYS", it checks if the `name` starts with "ECOFLOW_SYS_" and
   * returns the uppercase version of the name with spaces replaced by underscores. If the `type`
   * parameter is "USER", it checks if the `name` starts with "ECOFLOW_USER_" and returns the uppercase
   * version of the name with spaces replaced by underscores.
   */
  private generateEnvName(name: string, type: "SYS" | "USER" = "USER"): string {
    return type === "SYS"
      ? (name.startsWith("ECOFLOW_SYS_")
          ? name.toLocaleUpperCase()
          : ("ECOFLOW_SYS_" + name).toLocaleUpperCase()
        ).replace(/\s/g, "_")
      : (name.startsWith("ECOFLOW_USER_")
          ? name.toLocaleUpperCase()
          : ("ECOFLOW_USER_" + name).toLocaleUpperCase()
        ).replace(/\s/g, "_");
  }

  /**
   * The function generates environment variables based on the provided array of Environment objects and
   * a specified type.
   * @param {Environment[]} ENV - The `ENV` parameter is an array of objects representing environment
   * variables. Each object in the array has a `name` property representing the name of the environment
   * variable and a `value` property representing the value of the environment variable.
   * @param {"SYS" | "USER"} [type=USER] - The `type` parameter in the `generateENVs` function is a
   * string literal type that can have one of two values: "SYS" or "USER". The default value is "USER" if
   * no value is provided when calling the function.
   * @returns The `generateENVs` function returns a string that contains environment variable assignments
   * in the format `ENV_NAME=VALUE\n`.
   */
  private generateENVs(
    ENV: Environment[],
    type: "SYS" | "USER" = "USER"
  ): string {
    let env = "";
    ENV.map(
      (value) =>
        (env += `${new EnvBuilder().generateEnvName(value.name, type)}=${
          value.value
        }\n`)
    );
    return env;
  }

  /**
   * The function `updateEnvironment` updates environment variables based on the provided parameters and
   * type.
   * @param {string} envPath - The `envPath` parameter is a string that represents the path to the
   * environment file that will be updated with the new environment variables.
   * @param {Environment[]} ENV - The `ENV` parameter in the `updateEnvironment` method is an array of
   * `Environment` objects. These objects likely contain information about environment variables such as
   * name and value. The method processes this array to update the environment variables based on the
   * specified type ("SYS" or "USER") and other conditions
   * @param {"SYS" | "USER"} [type=USER] - The `type` parameter in the `updateEnvironment` function
   * specifies whether the environment variables being updated are system-wide (`SYS`) or user-specific
   * (`USER`). It has a default value of `"USER"`, meaning that if the `type` parameter is not provided
   * when calling the function, it will default
   * @param {boolean} [fileOverWrite=false] - The `fileOverWrite` parameter in the `updateEnvironment`
   * function is a boolean flag that determines whether existing environment variables should be
   * overwritten or not. If `fileOverWrite` is set to `true`, existing environment variables will be
   * overwritten with new values. If it is set to `false`,
   */
  private async updateEnvironment(
    envPath: string,
    ENV: Environment[],
    type: "SYS" | "USER" = "USER",
    fileOverWrite: boolean = false
  ): Promise<void> {
    const existingENVsList =
      type === "SYS"
        ? (EnvBuilder.getSystemEnv() as Environment[])
        : type === "USER"
        ? (EnvBuilder.getUserEnv() as Environment[])
        : [];
    const newEnvs: Environment[] = [];

    existingENVsList.forEach((envID) => {
      delete process.env[
        `${new EnvBuilder().generateEnvName(envID.name, type)}`
      ];
    });

    if (!fileOverWrite)
      existingENVsList.map((env) => {
        env.name = env.name.toUpperCase();
        if (typeof ENV !== "undefined") {
          ENV = ENV.filter((newEnv) => {
            newEnv.name = newEnv.name.toUpperCase();
            if (env.name === newEnv.name) {
              env.value = newEnv.value;
              return false;
            }
            return true;
          });
        }
        newEnvs.push(env);
        return;
      });

    newEnvs.push(...ENV);

    type === "SYS"
      ? await EnvBuilder.generateSystemEnv(envPath, newEnvs)
      : type === "USER"
      ? await EnvBuilder.generateUserEnv(envPath, newEnvs)
      : null;
  }

  /**
   * This function generates a system environment file based on the provided environment variables.
   * @param {string} envPath - The `envPath` parameter is a string that represents the path where the
   * environment file will be generated.
   * @param {Environment[]} ENV - The `ENV` parameter in the `generateSystemEnv` function is an array
   * of `Environment` objects.
   */
  static async generateSystemEnv(
    envPath: string,
    ENV: Environment[]
  ): Promise<void> {
    try {
      await fse.ensureDir(envPath);
      await fse.writeFile(
        path.join(envPath, "ecoflow.environments.env"),
        new EnvBuilder().generateENVs(ENV, "SYS")
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * The function `generateUserEnv` creates a user environment file based on the provided environment
   * data.
   * @param {string} envPath - The `envPath` parameter is a string that represents the path where the
   * user environment file will be generated.
   * @param {Environment[]} ENV - The `ENV` parameter in the `generateUserEnv` function is an array of
   * `Environment` objects.
   */
  static async generateUserEnv(
    envPath: string,
    ENV: Environment[]
  ): Promise<void> {
    try {
      await fse.ensureDir(envPath);
      await fse.writeFile(
        path.join(envPath, "user.environments.env"),
        new EnvBuilder().generateENVs(ENV, "USER")
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * The function `getSystemEnvNameList` returns an array of environment variable names of the
   * system environments.
   * @returns An array of environment variable names of the system environments.
   */
  static get getSystemEnvNameList(): string[] {
    return Object.keys(process.env).filter((val) =>
      val.startsWith("ECOFLOW_SYS_")
    );
  }

  /**
   * The function `getUserEnvNameList` returns an array of environment variable names of the
   * user environments.
   * @returns An array of environment variable names of the user environments.
   */
  static get getUserEnvNameList(): string[] {
    return Object.keys(process.env).filter((val) =>
      val.startsWith("ECOFLOW_USER_")
    );
  }

  /**
   * This function retrieves system environment variables based on the provided ID or returns
   * a list of all system environment variables if no ID is specified.
   * @param {string} [envID] - The `envID` parameter is an optional string that represents the ID of a
   * specific environment variable. If provided, the function will attempt to retrieve the value of the
   * environment variable with the corresponding ID. If not provided, the function will return
   * information about all system environment variables.
   * @returns If the `envID` parameter is not provided, an array of `Environment` objects is being
   * returned, where each object contains the `name` and `value` properties extracted from the
   * environment variables starting with "ECOFLOW_SYS_".
   */
  static getSystemEnv(envID?: string): Environment[] | Environment | null {
    const { _ } = ecoFlow;
    if (_.isUndefined(envID))
      return this.getSystemEnvNameList.map((env) => {
        return <Environment>{
          name: env.substring("ECOFLOW_SYS_".length),
          value: process.env[env],
        };
      });

    envID = envID.toLocaleUpperCase();
    if (typeof process.env[`ECOFLOW_SYS_${envID}`] !== "undefined")
      return {
        name: envID,
        value: process.env[`ECOFLOW_SYS_${envID}`]!,
      };
    return null;
  }

  /**
   * This function retrieves environment variables based on the provided ID or returns a list of all user
   * environment variables.
   * @param {string} [envID] - The `envID` parameter in the `getUserEnv` function is used to specify the
   * ID of the environment variable that the function is trying to retrieve. If `envID` is provided, the
   * function will attempt to retrieve the value of the corresponding environment variable. If `envID` is
   * not
   * @returns If the `envID` parameter is not provided, an array of `Environment` objects is being
   * returned, where each object contains the `name` and `value` properties extracted from the
   * environment variables starting with "ECOFLOW_USER_".
   */
  static getUserEnv(envID?: string): Environment | Environment[] {
    const { _ } = ecoFlow;
    if (_.isUndefined(envID))
      return this.getUserEnvNameList.map((env) => {
        return <Environment>{
          name: env.substring("ECOFLOW_USER_".length),
          value: process.env[env],
        };
      });
    envID = envID.toLocaleUpperCase();
    if (typeof process.env[`ECOFLOW_USER_${envID}`] !== "undefined")
      return {
        name: envID,
        value: process.env[`ECOFLOW_USER_${envID}`]!,
      };
    return [];
  }

  /**
   * This static function in TypeScript sets system environment variables based on the provided
   * Environment array and file path.
   * @param {string} envPath - The `envPath` parameter is a string that represents the path to the
   * environment file that needs to be updated.
   * @param {Environment[]} ENV - The `ENV` parameter in the `setSystemEnv` function is an array of
   * `Environment` objects.
   * @param {boolean} [fileOverWrite=false] - The `fileOverWrite` parameter is a boolean flag that
   * determines whether the existing file should be overwritten if it already exists. If `fileOverWrite`
   * is set to `true`, the file will be overwritten with the new environment settings. If it is set to
   * `false` (the default value
   */
  static async setSystemEnv(
    envPath: string,
    ENV: Environment[],
    fileOverWrite: boolean = false
  ) {
    try {
      await new EnvBuilder().updateEnvironment(
        envPath,
        ENV,
        "SYS",
        fileOverWrite
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * This static async function sets user environment variables in a specified file.
   * @param {string} envPath - The `envPath` parameter is a string that represents the path to the
   * environment file that will be updated with the new environment variables.
   * @param {Environment[]} ENV - The `ENV` parameter in the `setUserEnv` function is an array of
   * `Environment` objects. These objects likely represent different environment variables that need to
   * be set or updated in a specific environment configuration file located at the `envPath`. The
   * function uses an `EnvBuilder` instance to update
   * @param {boolean} [fileOverWrite=false] - The `fileOverWrite` parameter is a boolean flag that
   * determines whether the existing file should be overwritten when updating the environment settings.
   * If set to `true`, the file will be overwritten with the new environment settings. If set to `false`
   * (the default value), the new settings will be appended
   */
  static async setUserEnv(
    envPath: string,
    ENV: Environment[],
    fileOverWrite: boolean = false
  ): Promise<void> {
    try {
      await new EnvBuilder().updateEnvironment(
        envPath,
        ENV,
        "USER",
        fileOverWrite
      );
    } catch (err) {
      throw err;
    }
  }
}
