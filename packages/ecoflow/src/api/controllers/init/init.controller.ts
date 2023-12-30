import { Context } from "koa";

export const initStatus = (ctx: Context) => {
  let appStatus = { isAuth: ecoFlow.isAuth };

  ctx.body = appStatus;
};
