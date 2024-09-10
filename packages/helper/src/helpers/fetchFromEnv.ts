import { Environment } from "@ecoflow/types";
import { Builder } from "@ecoflow/utils/builder";

/**
 * Fetches a value from either the user or system environment based on the provided environment variable.
 * @param {string} env - The environment variable to fetch the value for.
 * @param {("user" | "system")} [type="user"] - The type of environment to fetch the value from (user or system).
 * @returns The value of the environment variable if found, otherwise returns undefined.
 */
const fetchFromEnv = (
  env: string,
  type: "user" | "system" = "user"
): string | undefined => {
  if (env.startsWith("env(") && env.endsWith(")")) {
    const name = env.substring(4, env.length - 1);
    return type === "user"
      ? (Builder.ENV.getUserEnv(name) as Environment).value
      : type === "system"
      ? (Builder.ENV.getSystemEnv(name) as Environment).value
      : name;
  }
  return env;
};

export default fetchFromEnv;
