import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const removeRole = async (ctx: Context) => {
  const { service } = ecoFlow;

  try {
    const { id } = ctx.params;

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await service.RoleService.removeRole(id!),
    };

    await service.AuditLogsService.addLog({
      message: `Role with id ${id} has been removed`,
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

export default removeRole;
