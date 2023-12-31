import { Context } from "koa";

export const initStatus = async (ctx: Context) => {
  let appStatus: any = { isAuth: ecoFlow.isAuth };

  ctx.body = appStatus;
};
