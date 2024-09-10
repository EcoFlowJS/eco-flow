import { EcoRouter } from "../../../service/EcoRouter.js";
import dashboardStatus from "../../controllers/dashboard/dashboardStatus.controller.js";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller.js";

const dashboardRouter = EcoRouter.createRouter();
export default dashboardRouter;

/**
 * Defines a route for getting the status of the dashboard.
 * @param {string} '/status' - The route path for the status endpoint.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} dashboardStatus - Controller function to handle the status request.
 * @returns None
 */
dashboardRouter.get("/status", isAuthenticated, dashboardStatus);
