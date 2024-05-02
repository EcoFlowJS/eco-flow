import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const fetchSearchPackagesCount = async (ctx: Context) => {
  const { ecoModule } = ecoFlow;
  try {
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await ecoModule.availablePackagesCounts,
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchSearchPackagesCount;
