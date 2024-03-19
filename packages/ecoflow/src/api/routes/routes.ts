import { Routes } from "@eco-flow/types";
import authRouter from "./auth";
import { EcoSystemAPIBuilder } from "@eco-flow/api";
import initRouter from "./init";
import schemaRouter from "./schema";
import adminRouter from "./admin";
import serverRouter from "./server";
import setupRouter from "./setup";
import roleRouter from "./role/role.route";
import userRouter from "./users/user.routes";

const apiBuilder = new EcoSystemAPIBuilder();
apiBuilder
  .createRouterRoute("/init", initRouter)
  .createRouterRoute("/auth", authRouter)
  .createRouterRoute("/schema", schemaRouter)
  .createRouterRoute("/admin", adminRouter)
  .createRouterRoute("/server", serverRouter)
  .createRouterRoute("/setup", setupRouter)
  .createRouterRoute("/role", roleRouter)
  .createRouterRoute("/users", userRouter);

const apiBaseRoutes: Routes[] = apiBuilder.route;

export default apiBaseRoutes;
