import { EcoRouter } from "../../../../service/EcoRouter.js";
import getNodes from "../../../controllers/nodes/getNodes.controller.js";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller.js";

const moduleNodeRouter = EcoRouter.createRouter();
export default moduleNodeRouter;

/**
 * Defines a route that handles GET requests to the root path ("/").
 * This route requires authentication before executing the getNodes function.
 * @param {string} "/" - The root path of the route.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} getNodes - The function that handles the GET request for nodes.
 * @returns None
 */
moduleNodeRouter.get("/", isAuthenticated, getNodes);

/**
 * Defines a route that handles GET requests for a specific node ID.
 * @param {string} "/id/:nodeId" - The route path that includes the node ID as a parameter.
 * @param {Function} isAuthenticated - Middleware function to authenticate the request.
 * @param {Function} getNodes - The handler function to retrieve nodes based on the node ID.
 * @returns None
 */
moduleNodeRouter.get("/id/:nodeId", isAuthenticated, getNodes);
