import { Builder } from "@eco-flow/utils";
import { Context } from "koa";

const getUserEnv = (ctx: Context) => {
  const { envID } = ctx.params;
  ctx.status = 200;
  ctx.body = Builder.ENV.getUserEnv(envID);
};

export default getUserEnv;
