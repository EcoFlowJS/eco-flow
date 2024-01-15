import { Context, Next } from "koa";
import passport from "koa-passport";
import _ from "lodash";

export default async function isAuthenticated(ctx: Context, next: Next) {
  return passport.authenticate("_ecoFlowPassport", async (err, result) => {
    if (err) {
      ctx.status = 401;
      ctx.body = {
        error: true,
        payload: err.toString(),
      };
    }

    if (typeof result === "boolean" && !result) {
      ctx.status = 401;
      ctx.body = {
        error: true,
        payload: "Token Expired",
      };
    }

    if (typeof result === "object" && !_.isEmpty(result)) {
      ctx.status = 200;
      ctx.body = {
        success: true,
        payload: result,
      };
      await next();
    }
  })(ctx, next);
}
