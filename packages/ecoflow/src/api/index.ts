import { EcoRouter } from "@eco-flow/types";
import routes from "./routes/routes";
import { EcoAPIController } from "@eco-flow/api";

export default function loadApiRoutes({ systemRouter }: EcoRouter) {
  routes.forEach((route) => {
    new EcoAPIController(route).registerAPI(systemRouter);
  });
}
