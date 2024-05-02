import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const installEcoPackages = async (ctx: Context) => {
  const { _, ecoModule, service } = ecoFlow;
  const { packageName, version } = ctx.request.body;

  try {
    if (_.isUndefined(packageName) || _.isEmpty(packageName))
      throw "Package name is required";
    if (_.isUndefined(version) || _.isEmpty(version))
      throw "Package name is required";

    const schema = await ecoModule.installModule(packageName, version);
    await ecoModule.addModule(schema);

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: schema.module,
    };

    await service.AuditLogsService.addLog({
      message: `New package(${packageName}) has been installed by ${ctx.user}`,
      type: "Info",
      userID: ctx.user,
    });
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default installEcoPackages;
