import Helper from "@eco-flow/helper";
import { Context, Next } from "koa";
import passport from "koa-passport";
import _ from "lodash";

const isAuthenticated = async (ctx: Context, next: Next) => {
  const { isAuth, service } = ecoFlow;
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
      if (!isAuth) {
        ctx.status = 200;
        ctx.token = result;
        ctx.body = {
          success: true,
          payload: result,
        };
        ctx.user = result._id;
      } else {
        const { UserService, TokenServices } = service;
        if (!(await UserService.isActiveUser(result._id))) {
          await TokenServices.removeToken(
            (await Helper.getCookie(ctx, "RefreshToken"))!,
            result._id
          );
          ctx.status = 400;
          ctx.body = {
            error: true,
            payload: "Not a Valid user.",
          };
        } else {
          ctx.status = 200;
          ctx.token = result;
          ctx.body = {
            success: true,
            payload: result,
          };
          ctx.user = result._id;
        }
      }
      await next();
    }
  })(ctx, next);
};

export default isAuthenticated;
