import { DefaultContext, DefaultState } from "koa";

export const isSetup = async (
  ctx: DefaultState,
  next: DefaultContext
): Promise<void> => {
  ctx.body = "setup";
};
