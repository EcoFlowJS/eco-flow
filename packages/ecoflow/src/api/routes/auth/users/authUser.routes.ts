import { EcoRouter } from "../../../../service/EcoRouter.js";
import refreshToken from "../../../controllers/user/refreshToken.controller.js";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller.js";
import userLogin from "../../../controllers/user/userLogin.controller.js";
import userLogout from "../../../controllers/user/userLogout.controller.js";

const authUserRouter = EcoRouter.createRouter();
export default authUserRouter;

/**
 * Defines a route that checks if a user is authenticated.
 * @param {string} "/isAuthenticated" - The route path for checking authentication status.
 * @param {Function} isAuthenticated - The function to handle the authentication check.
 * @returns None
 */
authUserRouter.get("/isAuthenticated", isAuthenticated);

/**
 * PATCH endpoint for refreshing user authentication token.
 * @param {string} "/refreshToken" - The endpoint for refreshing the token.
 * @param {Function} refreshToken - The function handling the token refresh logic.
 * @returns None
 */
authUserRouter.patch("/refreshToken", refreshToken);

/**
 * Defines a POST route for user login authentication.
 * @param {string} "/login" - The route path for user login.
 * @param {Function} userLogin - The callback function to handle user login.
 * @returns None
 */
authUserRouter.post("/login", userLogin);

/**
 * Defines a route for logging out a user.
 * @param {string} "/logout" - The route path for logging out.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} userLogout - Handler function for logging out the user.
 */
authUserRouter.delete("/logout", isAuthenticated, userLogout);
