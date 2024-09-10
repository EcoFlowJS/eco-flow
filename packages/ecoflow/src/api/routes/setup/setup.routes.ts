import { EcoRouter } from "../../../service/EcoRouter.js";
import setupBlankRouter from "./blank/blank.routes.js";
import setupImportRouter from "./import/import.routes.js";

const setupRouter = EcoRouter.createRouter();
export default setupRouter;

/**
 * Mounts the routes of the 'setupBlankRouter' under the '/blank' path in the 'setupRouter'.
 * @param {string} "/blank" - The base path for the routes.
 * @param {Router} setupBlankRouter - The router containing the routes to be mounted.
 * @returns None
 */
setupRouter.use("/blank", setupBlankRouter.routes());

setupRouter.use("/import", setupImportRouter.routes());
