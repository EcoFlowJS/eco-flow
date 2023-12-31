import { EcoRouter } from "../../../service/EcoRouter";
import { initStatus } from "../../controllers/init/init.controller";

const initRouter = EcoRouter.createRouter();
export default initRouter;

initRouter.get(
  "/status",
  // async (ctx, next) => {
  //   if (ctx.isAuthenticated()) {
  //     console.log("logged in");
  //     ctx.logOut();
  //     next();
  //   }
  // },
  initStatus
);
// initRouter.post("/test", async (ctx, next) => {
//   return ecoFlow.server.passport.authenticate(
//     "_ecoFlowPassport",
//     (err, user, info, status) => {
//       console.log(err, user, info, status);
//       ctx.body = "hello world";
//       ctx.status = 200;
//       ctx.login(user);
//     }
//   )(ctx, next);
// });
