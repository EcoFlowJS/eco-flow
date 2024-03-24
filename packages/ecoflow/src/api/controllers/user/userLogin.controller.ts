import Helper from "@eco-flow/helper";
import { ApiResponse, userTableCollection } from "@eco-flow/types";
import { Context } from "koa";

const userLogin = async (ctx: Context) => {
  const { username, password } = ctx.request.body;
  const { server, service } = ecoFlow;
  const { UserService, TokenServices } = service;
  const { isAvailable, user } = await UserService.getUserInfos(username);
  const options = server.isSecure
    ? {
        secure: true,
        httpOnly: true,
      }
    : {
        secure: false,
        httpOnly: true,
      };

  ctx.status = 200;

  if (!isAvailable) {
    ctx.body = <ApiResponse>{
      error: true,
      payload: `No user found with username ${username}`,
    };
    return;
  }

  if (
    !(await Helper.compareHash(password, (<userTableCollection>user).password!))
  ) {
    ctx.body = <ApiResponse>{
      error: true,
      payload: `Invalid password for ${username}`,
    };
    await service.AuditLogsService.addLog({
      message: `Invalid password for ${username}`,
      type: "Error",
      userID: "SYSTEM_LOG",
    });
    return;
  }

  const [access_token, refresh_token, refresh_token_expires_at] =
    await TokenServices.generateToken(username.toLowerCase());

  await Helper.setCookie(ctx, "RefreshToken", refresh_token, {
    ...options,
    expires: new Date(refresh_token_expires_at),
  });

  ctx.user = username.toLowerCase();
  ctx.body = <ApiResponse>{
    success: true,
    payload: access_token,
  };
};

export default userLogin;
