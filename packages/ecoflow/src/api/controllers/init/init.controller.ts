import { Context } from "koa";

export const initStatus = async (ctx: Context) => {
  const isAuth = !ecoFlow.isAuth;
  const isNoUser = await ecoFlow.service.UserService.isNoUser();
  let getAccessToken: string | undefined = undefined;

  if (isAuth && !isNoUser)
    getAccessToken = process.env.ECOFLOW_SYS_NOAUTH_ACCESS_TOKEN!;

  ctx.body = {
    isAuth: isAuth,
    isNewClient: isNoUser,
    getAccessToken: getAccessToken,
  };
};
