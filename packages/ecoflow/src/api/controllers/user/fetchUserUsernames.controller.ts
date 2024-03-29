import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const fetchUserUsernames = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { isSystem } = ctx.params;
  try {
    ctx.body = <ApiResponse>{
      success: true,
      payload: await service.UserService.getUsernames(isSystem),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchUserUsernames;
