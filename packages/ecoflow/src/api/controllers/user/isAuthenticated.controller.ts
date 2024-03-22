import { Context, Next } from "koa";
import passport from "koa-passport";
import _ from "lodash";

const isAuthenticated = async (ctx: Context, next: Next) => {
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
      ctx.token = result;
      ctx.body = {
        success: true,
        payload: result,
      };
      ctx.user = result._id;
      await next();
    }
  })(ctx, next);
};

export default isAuthenticated;
