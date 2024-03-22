import { Builder } from "@eco-flow/utils";
import { Context } from "koa";

const getEnv = (ctx: Context) => {
  const { envID } = ctx.params;
  ctx.status = 200;
  ctx.body = {
    systemEnvs: Builder.ENV.getSystemEnv(envID),
    userEnvs: Builder.ENV.getUserEnv(envID),
  };
};

export default getEnv;
