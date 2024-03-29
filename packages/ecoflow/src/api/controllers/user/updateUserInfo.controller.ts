import Helper from "@ecoflow/helper";
import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const updateUserInfo = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { userInfo, mode } = ctx.request.body;

  try {
    const { UserService, AuditLogsService } = service;
    ctx.status = 200;
    switch (mode) {
      case "info":
        await UserService.upddateUser(ctx.user, {
          name: userInfo.name,
          email: userInfo.email,
        });
        ctx.body = <ApiResponse>{
          success: true,
          payload: "User info updated successfully.",
        };
        await AuditLogsService.addLog({
          message: `User info updated successfully(SELF: ${ctx.user})`,
          type: "Info",
          userID: ctx.user,
        });
        break;

      case "PWD":
        const { oldPassword, newPassword, rePassword } = userInfo;

        if (
          _.isEmpty(oldPassword) ||
          _.isEmpty(newPassword) ||
          _.isEmpty(rePassword)
        )
          throw "Invalid parameters passed";

        if (newPassword !== rePassword) throw "The two passwords do not match";

        await UserService.updatePassword(ctx.user, oldPassword, newPassword);

        ctx.body = <ApiResponse>{
          success: true,
          payload: "Password updated successfully.",
        };
        await AuditLogsService.addLog({
          message: `Password updated successfully for username ${ctx.user} (SELF: ${ctx.user})`,
          type: "Info",
          userID: ctx.user,
        });
        break;
      default:
        ctx.status = 409;
        ctx.body = <ApiResponse>{
          error: true,
          payload: "Invalid mode specified",
        };
        break;
    }
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default updateUserInfo;
