import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const fetchInstalledModule = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;
  try {
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await ecoModule.installedModules,
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchInstalledModule;
