import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const fetchInstalledModuleDescription = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;
  const { name } = ctx.params;
  try {
    if (_.isUndefined(name) || _.isEmpty(name))
      throw "Module name is undefined";
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await ecoModule.getInstalledPackagesDescription(name),
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchInstalledModuleDescription;
