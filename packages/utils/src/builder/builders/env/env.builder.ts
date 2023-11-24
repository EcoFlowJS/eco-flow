import path from "path";
import fse from "fs-extra";
import _ from "lodash";

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
    ENV.forEach((values) => {
      if (!_.isEmpty(values.commentBefore))
        env += "#" + values.commentBefore?.replace(/\n/g, "\n#") + "\n";
      env +=
        new EnvBuilder().generateEnvName(values.name, type) +
        "=" +
        values.value +
        "\n";
    });
    return env;
  }

  private async updateEnvironment(
    envPath: string,
    envFileName: string,
    existingENVs: Environment[],
    ENV: Environment[],
    type: "SYS" | "USER" = "USER"
  ): Promise<string> {
    try {
      let envFile = path.join(envPath, envFileName);
      await fse.ensureFile(envFile);
      let env = await fse.readFile(envFile, {
        encoding: "utf-8",
      });

      existingENVs.forEach((value) => {
        let newENV = new EnvBuilder().generateENVs([value], type);
        env = env.replace(
          env.substring(
            env.search(new EnvBuilder().generateEnvName(value.name, type)),
            env.indexOf(
              "\n",
              env.search(new EnvBuilder().generateEnvName(value.name, type))
            ) + 1
          ),
          newENV
        );
      });

      return (env += new EnvBuilder().generateENVs(ENV, type));
    } catch (err) {
      throw err;
    }
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

  static get getSystemEnvNameList(): string[] {
    let list: Array<string> = [];
    for (const [name] of Object.entries(process.env)) {
      if (name.startsWith("ECOFLOW_SYS_"))
        list.push(name.substring("ECOFLOW_SYS_".length));
    }
    return list;
  }

  static get getSystemEnv(): Environment[] {
    let list: Array<Environment> = [];
    for (const [name, value] of Object.entries(process.env)) {
      if (name.startsWith("ECOFLOW_SYS_"))
        list.push({
          name: name.substring("ECOFLOW_SYS_".length),
          value: value!,
        });
    }
    return list;
  }

  static async setSystemEnv(envPath: string, ENV: Environment[]) {
    let existingENVList = EnvBuilder.getSystemEnv;
    let existingENVs: Environment[] = [];
    existingENVList.forEach((value) => {
      const remove = _.remove(
        ENV,
        (n) =>
          new EnvBuilder().generateEnvName(n.name, "SYS") ===
          new EnvBuilder().generateEnvName(value.name, "SYS")
      );

      if (remove.length > 0) existingENVs.push(remove[0]);
    });

    try {
      await fse.writeFile(
        path.join(envPath, "ecoflow.environments.env"),
        await new EnvBuilder().updateEnvironment(
          envPath,
          "ecoflow.environments.env",
          existingENVs,
          ENV,
          "SYS"
        )
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

  static get getUserEnvs(): Environment[] {
    let list: Environment[] = [];
    for (const [name, value] of Object.entries(process.env)) {
      if (name.startsWith("ECOFLOW_USER_"))
        list.push({
          name: name.substring("ECOFLOW_USER_".length),
          value: value!,
        });
    }
    return list;
  }

  static get getUserEnvNameList(): string[] {
    let list: Array<string> = [];
    for (const [name] of Object.entries(process.env)) {
      if (name.startsWith("ECOFLOW_USER_"))
        list.push(name.substring("ECOFLOW_USER_".length));
    }
    return list;
  }

  static async setUserEnv(envPath: string, ENV: Environment[]): Promise<void> {
    let existingENVList = EnvBuilder.getUserEnvs;
    let existingENVs: Environment[] = [];
    existingENVList.forEach((value) => {
      const remove = _.remove(
        ENV,
        (n) =>
          new EnvBuilder().generateEnvName(n.name, "USER") ===
          new EnvBuilder().generateEnvName(value.name, "USER")
      );

      if (remove.length > 0) existingENVs.push(remove[0]);
    });

    try {
      await fse.writeFile(
        path.join(envPath, "user.environments.env"),
        await new EnvBuilder().updateEnvironment(
          envPath,
          "user.environments.env",
          existingENVs,
          ENV,
          "USER"
        )
      );
    } catch (err) {
      throw err;
    }
  }
}

interface Environment {
  commentBefore?: string;
  name: string;
  value: string;
}
