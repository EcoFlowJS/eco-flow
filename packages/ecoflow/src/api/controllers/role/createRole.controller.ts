import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const createRole = async (ctx: Context) => {
  const { service } = ecoFlow;

  try {
    const { roleName, roleLike } = ctx.request.body;

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await service.RoleService.createRole(
        { name: roleName },
        roleLike
      ),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default createRole;
