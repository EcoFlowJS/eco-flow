import path from "path";
import fse from "fs-extra";
import _ from "lodash";
import { Environment } from "@eco-flow/types";

export class EnvBuilder {
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

  private async updateEnvironment(
    envPath: string,
    ENV: Environment[],
    type: "SYS" | "USER" = "USER",
    fileOverWrite: boolean = false
  ): Promise<void> {
    const existingENVsList =
      type === "SYS"
        ? EnvBuilder.getSystemEnvs
        : type === "USER"
        ? EnvBuilder.getUserEnvs
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

  static async generateSystemEnv(envPath: string, ENV: Environment[]) {
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

  static async generateUserEnv(envPath: string, ENV: Environment[]) {
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

  static get getSystemEnvNameList(): string[] {
    return Object.keys(process.env).filter((val) =>
      val.startsWith("ECOFLOW_SYS_")
    );
  }

  static get getUserEnvNameList(): string[] {
    return Object.keys(process.env).filter((val) =>
      val.startsWith("ECOFLOW_USER_")
    );
  }

  static get getSystemEnvs(): Environment[] {
    return this.getSystemEnvNameList.map((env) => {
      return <Environment>{
        name: env.substring("ECOFLOW_SYS_".length),
        value: process.env[env],
      };
    });
  }

  static get getUserEnvs(): Environment[] {
    return this.getUserEnvNameList.map((env) => {
      return <Environment>{
        name: env.substring("ECOFLOW_USER_".length),
        value: process.env[env],
      };
    });
  }

  static getSystemEnv(envID: string): Environment | null {
    envID = envID.toLocaleUpperCase();
    if (typeof process.env[`ECOFLOW_SYS_${envID}`] !== "undefined")
      return {
        name: envID,
        value: process.env[`ECOFLOW_SYS_${envID}`]!,
      };
    return null;
  }

  static getUserEnv(envID: string): Environment | null {
    envID = envID.toLocaleUpperCase();
    if (typeof process.env[`ECOFLOW_USER_${envID}`] !== "undefined")
      return {
        name: envID,
        value: process.env[`ECOFLOW_USER_${envID}`]!,
      };
    return null;
  }

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
