import Helper from "@eco-flow/helper";
import { Context, Next } from "koa";
import _ from "lodash";

const refreshToken = async (ctx: Context, next: Next) => {
  const { isAuth } = ecoFlow;
  if (!isAuth) {
    ctx.status = 200;
    ctx.body = {
      success: true,
      payload: process.env.ECOFLOW_SYS_NOAUTH_ACCESS_TOKEN,
    };
    return;
  }

  const { TokenServices, AuditLogsService } = ecoFlow.service;
  const options = ecoFlow.server.isSecure
    ? {
        secure: true,
        httpOnly: true,
      }
    : {
        secure: false,
        httpOnly: true,
      };

  const token = await Helper.getCookie(ctx, "RefreshToken");
  if (_.isUndefined(token)) {
    ctx.status = 403;
    ctx.body = {
      error: true,
      payload: "Not authorized User.",
    };
    await AuditLogsService.addLog({
      message: `Not authorized User.`,
      type: "Error",
      userID: "SYSTEM_LOG",
    });
    return;
  }
  const user = Helper.verifyJwtToken(token);
  if (user === null) {
    ctx.status = 403;
    ctx.body = {
      error: true,
      payload: "Invalid Refresh Token.",
    };
    await AuditLogsService.addLog({
      message: `Invalid Refresh Token.`,
      type: "Warning",
      userID: "SYSTEM_LOG",
    });
    return;
  }

  const { _id } = <{ _id: string }>user;
  if (!(await TokenServices.checkToken(token, _id))) {
    ctx.status = 403;
    ctx.body = {
      error: true,
      payload: "Refresh Token Tampered.",
    };
    await AuditLogsService.addLog({
      message: `Refresh Token Tampered`,
      type: "Warning",
      userID: "SYSTEM_LOG",
    });
    return;
  }

  const [access_token, refresh_token, refresh_token_expires_at] =
    await TokenServices.generateToken(_id);

  await Helper.setCookie(ctx, "RefreshToken", refresh_token, {
    ...options,
    expires: new Date(refresh_token_expires_at),
  });
  ctx.status = 200;
  ctx.body = {
    success: true,
    payload: access_token,
  };
};

export default refreshToken;
