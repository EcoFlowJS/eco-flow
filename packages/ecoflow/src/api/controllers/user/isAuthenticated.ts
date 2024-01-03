import { Context, Next } from "koa";
import passport from "koa-passport";
import _ from "lodash";

export default async (ctx: Context, next: Next) => {
  return passport.authenticate("_ecoFlowPassport", (err, result) => {
    const response = Object.create({});
    if (err) {
      response["error"] = true;
      response["payload"] = err.toString();
      ctx.status = 401;
    }

    if (typeof result === "boolean" && !result) {
      response["error"] = true;
      response["payload"] = "Token Expired";
      ctx.status = 401;
    }

    if (typeof result === "object" && !_.isEmpty(result)) {
      response["success"] = true;
      response["payload"] = result;
      ctx.status = 200;
    }

    ctx.body = response;
  })(ctx, next);
};
