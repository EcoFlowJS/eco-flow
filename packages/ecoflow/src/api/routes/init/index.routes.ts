import { EcoRouter } from "../../../service/EcoRouter.js";
import initStatus from "../../controllers/init/initStatus.controller.js";

const initRouter = EcoRouter.createRouter();
export default initRouter;

/**
 * Initializes a route for the "/status" endpoint with the initStatus handler function.
 * @param {string} "/status" - The endpoint path for the route.
 * @param {function} initStatus - The handler function for the "/status" endpoint.
 * @returns None
 */
initRouter.get("/status", initStatus);
