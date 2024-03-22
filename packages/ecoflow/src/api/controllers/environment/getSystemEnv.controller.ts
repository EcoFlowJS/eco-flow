import { Builder } from "@eco-flow/utils";
import { Context } from "koa";

const getSystemEnv = (ctx: Context) => {
  const { envID } = ctx.params;
  ctx.status = 200;
  ctx.body = Builder.ENV.getSystemEnv(envID);
};

export default getSystemEnv;
