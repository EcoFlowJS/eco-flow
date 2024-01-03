import { Routes } from "@eco-flow/types";
import authRouter from "./auth";
import { EcoSystemAPIBuilder } from "@eco-flow/api";
import initRouter from "./init";

const apiBuilder = new EcoSystemAPIBuilder();
apiBuilder
  .createRouterRoute("/init", initRouter)
  .createRouterRoute("/auth", authRouter);

const apiBaseRoutes: Routes[] = apiBuilder.route;

export default apiBaseRoutes;
