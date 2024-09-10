import { EcoRouter } from "../../../service/EcoRouter.js";
import fetchAuditLogs from "../../controllers/auditLogs/fetchAuditLogs.controller.js";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller.js";

const auditLogsRouter = EcoRouter.createRouter();
export default auditLogsRouter;

/**
 * Route that handles GET requests to fetch audit logs.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} fetchAuditLogs - Controller function to fetch audit logs.
 * @returns None
 */
auditLogsRouter.get("/", isAuthenticated, fetchAuditLogs);

/**
 * Defines a route for fetching audit logs based on the specified page.
 * @param {string} "/:page" - The route parameter indicating the page number.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} fetchAuditLogs - Handler function to fetch audit logs.
 * @returns None
 */
auditLogsRouter.get("/:page", isAuthenticated, fetchAuditLogs);
