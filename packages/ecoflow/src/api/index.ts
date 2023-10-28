import { EcoSystemAPIBuilder } from "@eco-flow/api";
import apiBaseRoutes from "./routes/routes";

export default function loadApiRoutes() {
  EcoSystemAPIBuilder.register(apiBaseRoutes);
}
