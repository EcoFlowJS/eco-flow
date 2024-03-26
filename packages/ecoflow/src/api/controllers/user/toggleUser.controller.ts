import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const toggleUser = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { userID } = ctx.params;

  if (_.isUndefined(userID)) throw "userID is undefined.";

  try {
    const { isActiveUser } = ctx.request.body;
    if (_.isUndefined(isActiveUser)) throw "isActiveUser is undefined.";

    const { UserService, AuditLogsService } = service;
    await UserService.upddateUser(
      userID,
      {
        isActive: isActiveUser,
      },
      true
    );

    ctx.body = <ApiResponse>{
      success: true,
      payload: {
        msg: `User successfully ${isActiveUser ? "Enabled" : "Disabled"}`,
        isActive: isActiveUser,
      },
    };

    await AuditLogsService.addLog({
      message: `User(${userID}) successfully ${
        isActiveUser ? "Enabled" : "Disabled"
      }`,
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

export default toggleUser;
