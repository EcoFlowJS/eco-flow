import { Context } from "koa";
import parseServerConfigHelper from "../../helpers/parseServerConfigHelper";

const updateConfig = async (ctx: Context) => {
  ctx.status = 200;
  try {
    const { config, service } = ecoFlow;

    const configs = await parseServerConfigHelper({
      ...(<any>ctx.request.body),
    });

    const newConfigs = await config.setConfig(configs);
    await service.AuditLogsService.addLog({
      message: "New server configuration has been updated",
      type: "Info",
      userID: ctx.user,
    });

    ctx.body = {
      success: true,
      payload: {
        msg: "Configuration updated successfully.",
        newConfigs: newConfigs,
      },
    };
  } catch (error) {
    ctx.body = {
      error: true,
      payload: error,
    };
  }
};

export default updateConfig;
