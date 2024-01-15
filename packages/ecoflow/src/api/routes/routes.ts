import { Routes } from "@eco-flow/types";
import authRouter from "./auth";
import { EcoSystemAPIBuilder } from "@eco-flow/api";
import initRouter from "./init";
import schemaRouter from "./schema";

const apiBuilder = new EcoSystemAPIBuilder();
apiBuilder
  .createRouterRoute("/init", initRouter)
  .createRouterRoute("/auth", authRouter)
  .createRouterRoute("/schema", schemaRouter);

const apiBaseRoutes: Routes[] = apiBuilder.route;

export default apiBaseRoutes;
