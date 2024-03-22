import { Context } from "koa";
import { Builder } from "@eco-flow/utils";
import { ApiResponse } from "@eco-flow/types";
import loadEnvironments from "../../../helper/env.helper";

const commitEnvs = async (ctx: Context) => {
  const { type, finalEnvs } = ctx.request.body;
  const { config, service } = ecoFlow;
  const { envDir } = config._config;

  switch (type) {
    case "user":
      await Builder.ENV.setUserEnv(envDir!, finalEnvs, true);
      loadEnvironments();
      await service.AuditLogsService.addLog({
        message: "User environments has been updated",
        type: "Info",
        userID: ctx.user,
      });

      ctx.status = 200;
      ctx.body = <ApiResponse>{
        success: true,
        payload: {
          msg: "Environments committed successfully.",
          newEnvs: Builder.ENV.getUserEnv(),
        },
      };
      break;
    case "system":
      await Builder.ENV.setSystemEnv(envDir!, finalEnvs);
      loadEnvironments();
      await service.AuditLogsService.addLog({
        message: "System environments has been updated",
        type: "Info",
        userID: ctx.user,
      });

      ctx.status = 200;
      ctx.body = <ApiResponse>{
        success: true,
        payload: {
          msg: "Environments committed successfully.",
          newEnvs: Builder.ENV.getSystemEnv(),
        },
      };
      break;
  }
};

export default commitEnvs;
