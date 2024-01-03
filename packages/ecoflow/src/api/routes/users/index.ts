import { Context } from "koa";
import { EcoRouter } from "../../../service/EcoRouter";
import passport from "koa-passport";

const userRouter = EcoRouter.createRouter();
export default userRouter;

userRouter.get(
  "/isAuthenticated",
  async (ctx: Context, next) => {
    return passport.authenticate("_ecoFlowPassport", (err, result) => {
      console.log(err, result);
      ctx.body = result;
    })(ctx, next);
  },
  (ctx) => (ctx.body = "false")
);
