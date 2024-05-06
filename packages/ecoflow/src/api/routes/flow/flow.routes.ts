import { EcoRouter } from "../../../service/EcoRouter";
import deployFlowConfiguration from "../../controllers/flow/deployFlowConfiguration.controller";
import getFlows from "../../controllers/flow/getFlows.controller";
import getSettings from "../../controllers/flow/getSettings.controller";
import updateSettings from "../../controllers/flow/updateSettings.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const flowRouter = EcoRouter.createRouter();
export default flowRouter;

/**
 * Defines a route using FlowRouter for the root URL ("/").
 * This route requires the user to be authenticated before executing the getFlows function.
 * @param {string} "/" - The URL path for the route.
 * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated.
 * @param {Function} getFlows - The function to execute when the route is accessed.
 * @returns None
 */
flowRouter.get("/", isAuthenticated, getFlows);

/**
 * Defines a route using FlowRouter that matches the pattern "/id/:flowName" and
 * calls the getFlows function when the route is accessed, after checking if the user
 * is authenticated.
 * @param {string} "/id/:flowName" - The route pattern to match
 * @param {Function} isAuthenticated - The function to check if the user is authenticated
 * @param {Function} getFlows - The function to call when the route is accessed
 * @returns None
 */
flowRouter.get("/id/:flowName", isAuthenticated, getFlows);

/**
 * Defines a route using FlowRouter for the "/settings" URL path.
 * @param {string} "/settings" - The URL path for the route.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} getSettings - Handler function to retrieve settings.
 */
flowRouter.get("/settings", isAuthenticated, getSettings);

/**
 * Defines a POST route for updating settings using FlowRouter.
 * @param {string} "/settings" - The route path for updating settings.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} updateSettings - Handler function for updating settings.
 * @returns None
 */
flowRouter.post("/settings", isAuthenticated, updateSettings);

/**
 * Defines a POST route at "/deploy" using FlowRouter that requires authentication
 * before executing the deployFlowConfiguration function.
 * @param {string} "/deploy" - The route path for the POST request.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} deployFlowConfiguration - Function to handle the deployment flow configuration.
 * @returns None
 */
flowRouter.post("/deploy", isAuthenticated, deployFlowConfiguration);
