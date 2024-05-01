import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const searchPackages = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;
  const { packageName } = ctx.params;
  try {
    if (_.isUndefined(packageName) || _.isEmpty(packageName))
      throw "Package name is not provided.";

    ctx.body = <ApiResponse>{
      success: true,
      payload: await ecoModule.searchModule(packageName),
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default searchPackages;
