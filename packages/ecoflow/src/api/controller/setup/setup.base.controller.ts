import Router from "@koa/router";
import { DefaultContext, DefaultState, Next, ParameterizedContext } from "koa";

export function baseController(
  ctx: ParameterizedContext<
    DefaultState,
    DefaultContext & Router.RouterParamContext<DefaultState, DefaultContext>,
    unknown
  >,
  next: Next
) {
  ctx.body = { error: "Access Forbidden" };
  ctx.status = 403;
}
