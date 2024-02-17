import Helper from "@eco-flow/helper";
import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const loginController = async (ctx: Context) => {
  const { username, password } = ctx.request.body;
  const { server, service } = ecoFlow;
  const { UserService, TokenServices } = service;
  const { isAvailable, user } = await UserService.getUserAllInfo(username);
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

  if (!(await Helper.compareHash(password, user!.password))) {
    ctx.body = <ApiResponse>{
      error: true,
      payload: `Invalid password for ${username}`,
    };
    return;
  }

  const [access_token, refresh_token, refresh_token_expires_at] =
    await TokenServices.generateToken(username);

  await Helper.setCookie(ctx, "RefreshToken", refresh_token, {
    ...options,
    expires: new Date(refresh_token_expires_at),
  });

  ctx.body = <ApiResponse>{
    success: true,
    payload: access_token,
  };
};

export default loginController;