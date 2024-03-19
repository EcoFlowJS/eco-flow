import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const fetchRole = async (ctx: Context) => {
  const { service } = ecoFlow;

  try {
    const { id } = ctx.params;

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await service.RoleService.fetchRole(id),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchRole;
