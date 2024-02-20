import Helper from "@eco-flow/helper";
import { Builder } from "@eco-flow/utils";
import { Context } from "koa";
import loadEnvironments from "../../../helper/env.helper";
import { ApiResponse } from "@eco-flow/types";

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

const commitEnvs = async (ctx: Context) => {
  const { type, finalEnvs } = ctx.request.body;
  const { envDir } = ecoFlow.config._config;

  switch (type) {
    case "user":
      await Builder.ENV.setUserEnv(envDir!, finalEnvs, true);
      loadEnvironments();
      ctx.status = 200;
      ctx.body = <ApiResponse>{
        success: true,
        payload: {
          msg: "Environments committed successfully.",
          newEnvs: Builder.ENV.getUserEnvs,
        },
      };
      break;
    case "system":
      await Builder.ENV.setSystemEnv(envDir!, finalEnvs);
      loadEnvironments();
      ctx.status = 200;
      ctx.body = <ApiResponse>{
        success: true,
        payload: {
          msg: "Environments committed successfully.",
          newEnvs: Builder.ENV.getSystemEnvs,
        },
      };
      break;

    default:
  }
};

export {
  getAllEnvs,
  getUserEnvs,
  getUserEnv,
  getSystemEnvs,
  getEnv,
  getSystemEnv,
  commitEnvs,
};
