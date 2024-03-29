import { ApiResponse } from "@ecoflow/types";
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

    await service.AuditLogsService.addLog({
      message: `New role named ${roleName} has been created`,
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

export default createRole;
