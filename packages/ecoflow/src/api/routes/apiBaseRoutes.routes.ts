import { Routes } from "@ecoflow/types";
import authRouter from "./auth/auth.routes.js";
import { EcoSystemAPIBuilder } from "@ecoflow/api";
import initRouter from "./init/index.routes.js";
import schemaRouter from "./schema/schema.routes.js";
import adminRouter from "./admin/admin.routes.js";
import serverRouter from "./server/server.routes.js";
import setupRouter from "./setup/setup.routes.js";
import roleRouter from "./role/role.routes.js";
import userRouter from "./users/user.routes.js";
import auditLogsRouter from "./auditLogs/auditLogs.routes.js";
import testAPIRouter from "./testAPI/testAPI.routes.js";
import moduleRouter from "./module/module.routes.js";
import flowRouter from "./flow/flow.routes.js";
import dashboardRouter from "./dashboard/dashboard.routes.js";
import directoryFetcher from "../controllers/base/directoryFetcher.controller.js";
import backupRestoreRouter from "./backupRestore/backupRestore.routes.js";
import exportRouter from "./export/export.routes.js";

/**
 * Creates a new instance of EcoSystemAPIBuilder to build APIs for the ecosystem.
 */
const apiBuilder = new EcoSystemAPIBuilder();

/**
 * Builds multiple router routes for different endpoints using the apiBuilder.
 * @returns None
 */
apiBuilder
  .createRouterRoute("/init", initRouter)
  .createRouterRoute("/auth", authRouter)
  .createRouterRoute("/schema", schemaRouter)
  .createRouterRoute("/admin", adminRouter)
  .createRouterRoute("/server", serverRouter)
  .createRouterRoute("/setup", setupRouter)
  .createRouterRoute("/role", roleRouter)
  .createRouterRoute("/users", userRouter)
  .createRouterRoute("/auditLogs", auditLogsRouter)
  .createRouterRoute("/module", moduleRouter)
  .createRouterRoute("/flows", flowRouter)
  .createRouterRoute("/dashboard", dashboardRouter)
  .createRouterRoute("/backupRestore", backupRestoreRouter)
  .createRouterRoute("/exports", exportRouter)
  .createRouterRoute("/testAPI", testAPIRouter);

/**
 * Creates a POST route for the "/directoriesStatus" endpoint using the provided directoryFetcher function.
 * @param {string} endpoint - The endpoint for the POST route.
 * @param {Function} handler - The function that handles the POST request.
 * @returns None
 */
apiBuilder.createPOSTRoute("/directoriesStatus", directoryFetcher);

/**
 * Retrieves the base routes from the API builder and stores them in an array of Routes.
 * @returns {Routes[]} An array of base routes from the API builder.
 */
const apiBaseRoutes: Routes[] = apiBuilder.route;

export default apiBaseRoutes;
