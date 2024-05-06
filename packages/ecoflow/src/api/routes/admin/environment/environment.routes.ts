import { EcoRouter } from "../../../../service/EcoRouter";
import commitEnvs from "../../../controllers/environment/commitEnvs.controller";
import getEnv from "../../../controllers/environment/getEnv.controller";
import getSystemEnv from "../../../controllers/environment/getSystemEnv.controller";
import getUserEnv from "../../../controllers/environment/getUserEnv.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";

const environmentRouter = EcoRouter.createRouter();
export default environmentRouter;

/**
 * Defines a route for handling GET requests to retrieve environment information.
 * @param {string} "/envs" - The route path for the GET request.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} getEnv - Handler function to retrieve environment information.
 * @returns None
 */
environmentRouter.get("/envs", isAuthenticated, getEnv);

/**
 * Defines a route for handling GET requests to retrieve environment details based on the environment ID.
 * @param {string} "/env/:envID" - The route path that includes the environment ID as a parameter.
 * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated.
 * @param {Function} getEnv - Handler function to retrieve environment details.
 * @returns None
 */
environmentRouter.get("/env/:envID", isAuthenticated, getEnv);

/**
 * Defines a route for handling requests to retrieve user environments.
 * @param {string} "/userEnvs" - The URL path for the route.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} getUserEnv - Handler function to retrieve user environments.
 * @returns None
 */
environmentRouter.get("/userEnvs", isAuthenticated, getUserEnv);

/**
 * Defines a route for getting user environment based on the environment ID.
 * @param {string} "/userEnv/:envID" - The route path for getting user environment with a specific ID.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} getUserEnv - Controller function to handle getting user environment.
 * @returns None
 */
environmentRouter.get("/userEnv/:envID", isAuthenticated, getUserEnv);

/**
 * Defines a route for handling GET requests to retrieve system environment variables.
 * @param {string} "/systemEnvs" - The route path for accessing system environment variables.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} getSystemEnv - Handler function to retrieve system environment variables.
 * @returns None
 */
environmentRouter.get("/systemEnvs", isAuthenticated, getSystemEnv);

/**
 * Defines a route for retrieving system environment information based on the environment ID.
 * @param {string} "/systemEnv/:envID" - The route path for accessing system environment information.
 * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated.
 * @param {Function} getSystemEnv - Controller function to handle the retrieval of system environment information.
 * @returns None
 */
environmentRouter.get("/systemEnv/:envID", isAuthenticated, getSystemEnv);

/**
 * Defines a POST route for creating new environments.
 * @param {string} "/envs" - The endpoint for creating new environments.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} commitEnvs - Handler function to commit new environments.
 * @returns None
 */
environmentRouter.post("/envs", isAuthenticated, commitEnvs);
