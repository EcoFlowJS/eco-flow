import { EcoSystemAPIBuilder } from "@eco-flow/api";
import apiBaseRoutes from "./routes/routes";

export default () => {
  EcoSystemAPIBuilder.register(apiBaseRoutes);
};
