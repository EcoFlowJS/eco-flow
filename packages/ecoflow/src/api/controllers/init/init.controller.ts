import { Context } from "koa";

export const initStatus = async (ctx: Context) => {
  let appStatus: any = {
    isAuth: ecoFlow.isAuth,
    isNewClient: !ecoFlow.service.UserService.isNoUser(),
  };
  ctx.body = appStatus;
};
