import { EcoRouter } from "../../../../service/EcoRouter";
import fetchRoles from "../../../controllers/user/fetchRoles.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";

const userRolesRouter = EcoRouter.createRouter();
export default userRolesRouter;

/**
 * Defines a route that handles GET requests to retrieve user roles.
 * @param {string} "/" - The route path
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated
 * @param {Function} fetchRoles - Handler function to fetch user roles
 * @returns None
 */
userRolesRouter.get("/", isAuthenticated, fetchRoles);
