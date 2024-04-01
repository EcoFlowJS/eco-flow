import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const fetchModule = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;
  const { moduleID } = ctx.params;

  ctx.status = 200;
  ctx.body = <ApiResponse>{
    success: true,
    payload: _.isUndefined(moduleID)
      ? ecoModule.getModule()
      : ecoModule.getModule(moduleID),
  };
};

export default fetchModule;
