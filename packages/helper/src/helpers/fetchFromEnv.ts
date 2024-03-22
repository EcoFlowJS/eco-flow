import { Environment } from "@eco-flow/types";
import { Builder } from "@eco-flow/utils";

export default (
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
