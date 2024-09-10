import { EcoRouter } from "../../../service/EcoRouter.js";
import adminConfigRouter from "./config/config.routes.js";
import environmentRouter from "./environment/environment.routes.js";
import adminUsersRouter from "./users/users.routes.js";

const adminRouter = EcoRouter.createRouter();
export default adminRouter;

/**
 * Defines a route for handling GET requests to the adminRouter endpoint.
 * @param {Object} ctx - The context object representing the request and response.
 * @returns None
 */
adminRouter.get("/", (ctx) => (ctx.body = "adminRouter"));

/**
 * Mounts the routes defined in the adminConfigRouter under the "/config" path in the adminRouter.
 * @param {string} "/config" - The base path for the routes.
 * @param {Router} adminConfigRouter - The router containing the configuration routes.
 * @returns None
 */
adminRouter.use("/config", adminConfigRouter.routes());

/**
 * Mounts the environmentRouter middleware at the "/environment" path.
 * @param {string} "/environment" - The path at which the environmentRouter middleware will be mounted.
 * @param {Router} environmentRouter - The router middleware to be mounted.
 * @returns None
 */
adminRouter.use("/environment", environmentRouter.routes());

/**
 * Mounts the routes defined in the adminUsersRouter under the "/users" path.
 * @param {string} "/users" - The base path for the user routes.
 * @param {Router} adminUsersRouter - The router containing the user routes.
 * @returns None
 */
adminRouter.use("/users", adminUsersRouter.routes());
