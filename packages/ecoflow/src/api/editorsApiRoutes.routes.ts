import { EcoSystemAPIBuilder } from "@ecoflow/api";
import apiBaseRoutes from "./routes/apiBaseRoutes.routes";

const editorsApiRoutes = () => {
  EcoSystemAPIBuilder.register(apiBaseRoutes);
};

export default editorsApiRoutes;
