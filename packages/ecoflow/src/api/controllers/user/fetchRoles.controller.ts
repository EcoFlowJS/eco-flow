import { ApiResponse, Role, userTableCollection } from "@eco-flow/types";
import { Context } from "koa";

const fetchRoles = async (ctx: Context) => {
  const { _, service } = ecoFlow;

  try {
    const { UserService, RoleService } = service;
    const userRoles =
      (await UserService.getUserInfos(ctx.user)).user!.roles || [];

    const result = [];
    for await (const roleID of userRoles) {
      result.push(((await RoleService.fetchRole(roleID)) as Role[])[0].name);
    }

    ctx.body = <ApiResponse>{
      success: true,
      payload: result,
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchRoles;
