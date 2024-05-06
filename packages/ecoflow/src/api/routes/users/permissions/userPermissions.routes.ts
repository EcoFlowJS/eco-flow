import { EcoRouter } from "../../../../service/EcoRouter";
import fetchPermissions from "../../../controllers/user/fetchPermissions.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";

const userPermissionsRouter = EcoRouter.createRouter();
export default userPermissionsRouter;

/**
 * Defines a route that handles GET requests to retrieve user permissions.
 * @param {string} "/" - The route path
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated
 * @param {Function} fetchPermissions - Handler function to fetch user permissions
 * @returns None
 */
userPermissionsRouter.get("/", isAuthenticated, fetchPermissions);

/**
 * Defines a route for handling user permissions based on the mode specified in the URL.
 * @param {string} "/:mode" - The route path with a dynamic parameter 'mode'.
 * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated.
 * @param {Function} fetchPermissions - Handler function to fetch and handle user permissions.
 * @returns None
 */
userPermissionsRouter.get("/:mode", isAuthenticated, fetchPermissions);
