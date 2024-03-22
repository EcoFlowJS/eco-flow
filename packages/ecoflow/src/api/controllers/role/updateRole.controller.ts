import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const updateRole = async (ctx: Context) => {
  const { service, _ } = ecoFlow;

  try {
    const { id, permissions } = ctx.request.body;

    if (_.isUndefined(id) || _.isUndefined(permissions))
      throw "Invalid permissions for role update";

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await service.RoleService.updateRole(id!, permissions!),
    };

    await service.AuditLogsService.addLog({
      message: `role with id ${id} has been updated`,
      type: "Info",
      userID: ctx.user,
    });
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default updateRole;
