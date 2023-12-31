import { Context } from "koa";

export const initStatus = async (ctx: Context) => {
  let appStatus: any = {
    isAuth: ecoFlow.isAuth,
    isNewClient: await ecoFlow.service.UserService.isNoUser(),
  };
  ctx.body = appStatus;
};
