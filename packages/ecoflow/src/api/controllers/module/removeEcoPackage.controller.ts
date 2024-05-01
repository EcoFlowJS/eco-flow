import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const removeEcoPackage = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;
  const { packageName } = ctx.params;
  try {
    if (_.isUndefined(packageName)) throw "package name is required.";

    await ecoModule.removeModule(packageName);
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: "Package removed successfully",
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default removeEcoPackage;
