import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const installEcoPackages = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;
  const { packageName, version } = ctx.request.body;

  try {
    if (_.isUndefined(packageName) || _.isEmpty(packageName))
      throw "Package name is required";
    if (_.isUndefined(version) || _.isEmpty(version))
      throw "Package name is required";

    const { module, ...rest } = await ecoModule.installModule(
      packageName,
      version
    );
    await ecoModule.addModule({ module, ...rest });

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: module,
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default installEcoPackages;
