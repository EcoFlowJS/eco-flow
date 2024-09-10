import { EcoRouter } from "../../../service/EcoRouter.js";
import createRole from "../../controllers/role/createRole.controller.js";
import fetchRole from "../../controllers/role/fetchRole.controller.js";
import removeRole from "../../controllers/role/removeRole.controller.js";
import updateRole from "../../controllers/role/updateRole.controller.js";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller.js";

const roleRouter = EcoRouter.createRouter();
export default roleRouter;

/**
 * Defines a route that handles GET requests to the root path ("/").
 * This route requires the user to be authenticated before accessing it.
 * The fetchRole function is called to handle the request.
 * @returns None
 */
roleRouter.get("/", isAuthenticated, fetchRole);

/**
 * Defines a route that handles GET requests for a specific role by ID.
 * @param {string} "/:id" - The route path that includes the role ID as a parameter.
 * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated.
 * @param {Function} fetchRole - Controller function to fetch the role by ID.
 * @returns None
 */
roleRouter.get("/:id", isAuthenticated, fetchRole);

/**
 * Defines a POST route for creating a new role.
 * @param {string} "/" - The route path for creating a new role.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} createRole - Handler function for creating a new role.
 * @returns None
 */
roleRouter.post("/", isAuthenticated, createRole);

/**
 * PATCH request route for updating a role, requires authentication.
 * @param {string} "/" - The endpoint for updating a role.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} updateRole - Controller function to handle updating a role.
 * @returns None
 */
roleRouter.patch("/", isAuthenticated, updateRole);

/**
 * Defines a route that handles DELETE requests to remove a role by its ID.
 * @param {string} "/:id" - The route path that includes the ID of the role to be removed.
 * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated.
 * @param {Function} removeRole - Handler function to remove the role.
 * @returns None
 */
roleRouter.delete("/:id", isAuthenticated, removeRole);
