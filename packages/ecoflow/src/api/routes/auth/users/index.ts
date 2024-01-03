import { Context, Next } from "koa";
import passport from "koa-passport";
import { EcoRouter } from "../../../../service/EcoRouter";
import tokenController from "../../../controllers/user/token.controller";

const userRouter = EcoRouter.createRouter();
export default userRouter;

userRouter.get(
  "/isAuthenticated",
  async (ctx: Context, next) => {
    return passport.authenticate(
      "_ecoFlowPassport",
      (err, result, info, status) => {
        console.log(err, result, info, status);
        ctx.body = result;
      }
    )(ctx, next);
  },
  (ctx) => (ctx.body = "false")
);

userRouter.put("/refreshToken", tokenController.refreshToken);
