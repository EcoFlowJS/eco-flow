import { EcoRouter } from "../../../service/EcoRouter";
import isServerOnline from "../../controllers/server/isServerOnline.controller";
import serverCloseRestart from "../../controllers/server/serverCloseRestart.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const serverRouter = EcoRouter.createRouter();
export default serverRouter;

/**
 * Defines a POST route on the server root path ("/") that requires authentication
 * before executing the serverCloseRestart function.
 * @param {string} "/" - The route path
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated
 * @param {Function} serverCloseRestart - Function to execute when route is accessed
 * @returns None
 */
serverRouter.post("/", isAuthenticated, serverCloseRestart);

/**
 * Defines a route for checking if the server is online.
 * @param {string} "/isOnline" - The route path for checking server status.
 * @param {Function} isServerOnline - The handler function to determine server online status.
 * @returns None
 */
serverRouter.get("/isOnline", isServerOnline);
