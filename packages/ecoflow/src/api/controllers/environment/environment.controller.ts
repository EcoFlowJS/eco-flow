import { Builder } from "@eco-flow/utils";
import { Context } from "koa";

const getAllEnvs = (ctx: Context) => {
  ctx.status = 200;
  ctx.body = {
    systemEnvs: Builder.ENV.getSystemEnvs,
    userEnvs: Builder.ENV.getUserEnvs,
  };
};

const getEnv = (ctx: Context) => {
  const { envID } = ctx.params;
  ctx.status = 200;
  ctx.body = {
    systemEnvs: Builder.ENV.getSystemEnv(envID),
    userEnvs: Builder.ENV.getUserEnv(envID),
  };
};

const getUserEnvs = (ctx: Context) => {
  ctx.status = 200;
  ctx.body = Builder.ENV.getUserEnvs;
};

const getUserEnv = (ctx: Context) => {
  const { envID } = ctx.params;
  ctx.status = 200;
  ctx.body = Builder.ENV.getUserEnv(envID);
};

const getSystemEnvs = (ctx: Context) => {
  ctx.status = 200;
  ctx.body = Builder.ENV.getSystemEnvs;
};

const getSystemEnv = (ctx: Context) => {
  const { envID } = ctx.params;
  ctx.status = 200;
  ctx.body = Builder.ENV.getSystemEnv(envID);
};

export {
  getAllEnvs,
  getUserEnvs,
  getUserEnv,
  getSystemEnvs,
  getEnv,
  getSystemEnv,
};
