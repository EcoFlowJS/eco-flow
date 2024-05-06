import { EcoRouter } from "../../../../service/EcoRouter";
import getConfigs from "../../../controllers/config/getConfigs.controller";
import updateConfig from "../../../controllers/config/updateConfig.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";

const adminConfigRouter = EcoRouter.createRouter();
export default adminConfigRouter;

/**
 * Route that handles GET requests to retrieve admin configurations.
 * @param {string} "/" - The route path for the GET request.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} getConfigs - Controller function to retrieve admin configurations.
 * @returns None
 */
adminConfigRouter.get("/", isAuthenticated, getConfigs);

/**
 * Route handler for getting a specific configuration based on the configID.
 * @param {string} configID - The ID of the configuration to retrieve.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} getConfigs - The controller function to handle the retrieval of configurations.
 * @returns None
 */
adminConfigRouter.get("/:configID", isAuthenticated, getConfigs);

/**
 * Updates the configuration settings for the admin panel.
 * @param {Request} req - The request object containing the new configuration data.
 * @param {Response} res - The response object to send back the result of the update.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns None
 */
adminConfigRouter.put("/", isAuthenticated, updateConfig);
