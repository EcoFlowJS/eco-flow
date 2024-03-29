import { Context } from "koa";
import { Builder } from "@ecoflow/utils";
import { ApiResponse } from "@ecoflow/types";
import loadEnvironments from "../../../helper/env.helper";

const commitEnvs = async (ctx: Context) => {
  const { type, finalEnvs } = ctx.request.body;
  const { config, service } = ecoFlow;
  const { envDir } = config._config;

  switch (type) {
    case "user":
      await Builder.ENV.setUserEnv(envDir!, finalEnvs, true);
      loadEnvironments();

      ctx.status = 200;
      ctx.body = <ApiResponse>{
        success: true,
        payload: {
          msg: "Environments committed successfully.",
          newEnvs: Builder.ENV.getUserEnv(),
        },
      };

      await service.AuditLogsService.addLog({
        message: "User environments has been updated",
        type: "Info",
        userID: ctx.user,
      });
      break;
    case "system":
      await Builder.ENV.setSystemEnv(envDir!, finalEnvs);
      loadEnvironments();
      ctx.status = 200;
      ctx.body = <ApiResponse>{
        success: true,
        payload: {
          msg: "Environments committed successfully.",
          newEnvs: Builder.ENV.getSystemEnv(),
        },
      };

      await service.AuditLogsService.addLog({
        message: "System environments has been updated",
        type: "Info",
        userID: ctx.user,
      });
      break;
  }
};

export default commitEnvs;
