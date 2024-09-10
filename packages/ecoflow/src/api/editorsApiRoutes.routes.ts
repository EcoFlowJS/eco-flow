import { EcoSystemAPIBuilder } from "@ecoflow/api";
import apiBaseRoutes from "./routes/apiBaseRoutes.routes.js";

/**
 * Registers the base API routes for the EcoSystem API Builder.
 * @returns None
 */
const editorsApiRoutes = () => {
  EcoSystemAPIBuilder.register(apiBaseRoutes);
};

export default editorsApiRoutes;
