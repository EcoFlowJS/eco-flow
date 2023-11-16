import Router from "@koa/router";
import { DefaultContext, DefaultState, Next, ParameterizedContext } from "koa";

export const isNewInitialization = async (
  ctx: ParameterizedContext<
    DefaultState,
    DefaultContext & Router.RouterParamContext<DefaultState, DefaultContext>,
    unknown
  >,
  next: Next
): Promise<void> => {
  ctx.body = "setup";
};