import { Routes } from "@eco-flow/types";
import authRouter from "./auth";
import setupRouter from "./setup";
import { isNewInitialization } from "../controller/base.controller";
import { EcoSystemAPIBuilder } from "@eco-flow/api";

const apiBuilder = new EcoSystemAPIBuilder();
apiBuilder
  .createRouterRoute("/setup", setupRouter)
  .createRouterRoute("/auth", authRouter);

const apiBaseRoutes: Routes[] = apiBuilder.route;

export default apiBaseRoutes;
