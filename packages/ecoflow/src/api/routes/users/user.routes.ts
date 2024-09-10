import { EcoRouter } from "../../../service/EcoRouter.js";
import fetchUserInfo from "../../controllers/user/fetchUserInfo.controller.js";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller.js";
import updateUserInfo from "../../controllers/user/updateUserInfo.controller.js";
import userPermissionsRouter from "./permissions/userPermissions.routes.js";
import userRolesRouter from "./roles/userRoles.routes.js";

const userRouter = EcoRouter.createRouter();
export default userRouter;

/**
 * Defines a route for handling GET requests to the root URL ("/").
 * It first checks if the user is authenticated, and then calls the fetchUserInfo function.
 * @param {string} "/" - The root URL path
 * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated
 * @param {Function} fetchUserInfo - Handler function to fetch user information
 * @returns None
 */
userRouter.get("/", isAuthenticated, fetchUserInfo);

/**
 * PATCH request handler for updating user information.
 * @param {string} "/" - The route path for updating user information.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} updateUserInfo - Controller function to update user information.
 * @returns None
 */
userRouter.patch("/", isAuthenticated, updateUserInfo);

/**
 * Mounts the routes of the userPermissionsRouter under the "/permissions" path in the userRouter.
 * @param {string} "/permissions" - The path to mount the userPermissionsRouter routes under.
 * @param {Router} userPermissionsRouter - The router containing the permissions routes.
 * @returns None
 */
userRouter.use("/permissions", userPermissionsRouter.routes());

/**
 * Mounts the routes defined in the userRolesRouter to the "/roles" path in the userRouter.
 * @param {string} "/roles" - The path to mount the routes on.
 * @param {Router} userRolesRouter - The router containing the routes to be mounted.
 * @returns None
 */
userRouter.use("/roles", userRolesRouter.routes());
