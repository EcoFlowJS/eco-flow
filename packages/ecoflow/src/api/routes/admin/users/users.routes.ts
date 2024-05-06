import { EcoRouter } from "../../../../service/EcoRouter";
import createUser from "../../../controllers/user/createUser.controller";
import fetchUserDetails from "../../../controllers/user/fetchUserDetails.controller";
import fetchUserUsernames from "../../../controllers/user/fetchUserUsernames.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";
import toggleUser from "../../../controllers/user/toggleUser.controller";
import updateUser from "../../../controllers/user/updateUser.controller";

const adminUsersRouter = EcoRouter.createRouter();
export default adminUsersRouter;

/**
 * Defines a route for retrieving usernames of all users.
 * @param {string} "/usernames" - The endpoint for retrieving usernames.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} fetchUserUsernames - Handler function to fetch usernames of all users.
 * @returns None
 */
adminUsersRouter.get("/usernames", isAuthenticated, fetchUserUsernames);

/**
 * Route to get usernames based on whether they are system users or not.
 * @param {string} "/usernames/:isSystem" - The route path for getting usernames.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} fetchUserUsernames - Middleware function to fetch usernames based on system status.
 * @returns None
 */
adminUsersRouter.get(
  "/usernames/:isSystem",
  isAuthenticated,
  fetchUserUsernames
);

/**
 * Route to handle GET requests for retrieving details of a specific user.
 * @param {string} "/:userID" - The route parameter representing the user ID.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} fetchUserDetails - Controller function to fetch details of the user.
 * @returns None
 */
adminUsersRouter.get("/:userID", isAuthenticated, fetchUserDetails);

/**
 * Route that handles POST requests to create a new user by calling the createUser function.
 * @param {string} "/" - The endpoint for creating a new user.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} createUser - Function that creates a new user.
 * @returns None
 */
adminUsersRouter.post("/", isAuthenticated, createUser);

/**
 * Define a PATCH route for updating a user with a specific userID.
 * @param {string} "/:userID" - The route path that includes the userID parameter.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} updateUser - Controller function to handle updating user information.
 */
adminUsersRouter.patch("/:userID", isAuthenticated, updateUser);

/**
 * PATCH route that toggles the user enable/disable for the specified user ID.
 * @param {string} "/:userID/ToggleUser" - The route path that includes the user ID.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} toggleUser - Controller function that toggles the user status.
 */
adminUsersRouter.patch("/:userID/ToggleUser", isAuthenticated, toggleUser);
