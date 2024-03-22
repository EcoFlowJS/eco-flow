import { Routes } from "@eco-flow/types";
import authRouter from "./auth/auth.routes";
import { EcoSystemAPIBuilder } from "@eco-flow/api";
import initRouter from "./init/index.routes";
import schemaRouter from "./schema/schema.routes";
import adminRouter from "./admin/admin.routes";
import serverRouter from "./server/server.routes";
import setupRouter from "./setup/setup.routes";
import roleRouter from "./role/role.routes";
import userRouter from "./users/user.routes";
import auditLogsRouter from "./auditLogs/auditLogs.routes";

const apiBuilder = new EcoSystemAPIBuilder();
apiBuilder
  .createRouterRoute("/init", initRouter)
  .createRouterRoute("/auth", authRouter)
  .createRouterRoute("/schema", schemaRouter)
  .createRouterRoute("/admin", adminRouter)
  .createRouterRoute("/server", serverRouter)
  .createRouterRoute("/setup", setupRouter)
  .createRouterRoute("/role", roleRouter)
  .createRouterRoute("/users", userRouter)
  .createRouterRoute("/auditLogs", auditLogsRouter);

const apiBaseRoutes: Routes[] = apiBuilder.route;

export default apiBaseRoutes;
