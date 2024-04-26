import { Context } from "koa";
import parseServerConfigHelper from "../../helpers/parseServerConfigHelper";

const updateConfig = async (ctx: Context) => {
  ctx.status = 200;
  try {
    const { config, service } = ecoFlow;

    const configs = await parseServerConfigHelper({
      ...(<any>ctx.request.body),
      userID: ctx.user,
    });

    const newConfigs = await config.setConfig(configs);
    ctx.body = {
      success: true,
      payload: {
        msg: "Configuration updated successfully.",
        newConfigs: newConfigs,
      },
    };

    await service.AuditLogsService.addLog({
      message: "New server configuration has been updated",
      type: "Info",
      userID: ctx.user,
    });
  } catch (error) {
    ctx.body = {
      error: true,
      payload: error,
    };
  }
};

export default updateConfig;
