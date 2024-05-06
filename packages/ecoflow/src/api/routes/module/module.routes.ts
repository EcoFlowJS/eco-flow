import { EcoRouter } from "../../../service/EcoRouter";
import fetchInstalledModule from "../../controllers/module/fetchInstalledModule.controller";
import fetchInstalledModuleDescription from "../../controllers/module/fetchInstalledModuleDescription.controller";
import fetchModule from "../../controllers/module/fetchModule.controller";
import fetchSearchPackagesCount from "../../controllers/module/fetchSearchPackagesCount.controller";
import importEcoPackages from "../../controllers/module/importEcoPackages.controller";
import installEcoPackages from "../../controllers/module/installEcoPackages.controller";
import removeEcoPackage from "../../controllers/module/removeEcoPackage.controller";
import searchPackages from "../../controllers/module/searchPackages.controller";
import upgradeDowngradePackage from "../../controllers/module/upgradeDowngradePackage.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";
import moduleNodeRouter from "./node/node.routes";

const moduleRouter = EcoRouter.createRouter();
export default moduleRouter;

/**
 * Route handler for GET requests to the root URL ("/").
 * This handler first checks if the user is authenticated using the isAuthenticated middleware,
 * and then fetches the module using the fetchModule function.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns None
 */
moduleRouter.get("/", isAuthenticated, fetchModule);

/**
 * Defines a route for fetching a module based on the provided module ID.
 * @param {string} "/id/:moduleID" - The route path that includes the module ID as a parameter.
 * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated.
 * @param {Function} fetchModule - Handler function to fetch the module based on the ID.
 * @returns None
 */
moduleRouter.get("/id/:moduleID", isAuthenticated, fetchModule);

/**
 * Defines a route for installing packages, which requires authentication and fetches installed modules.
 * @param {string} "/installPackages" - The route path for installing packages.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} fetchInstalledModule - Handler function to fetch installed modules.
 */
moduleRouter.get("/installPackages", isAuthenticated, fetchInstalledModule);

/**
 * Defines a route for installing packages with a specific ID and name.
 * @param {string} "/installPackages/id/:name" - The route path for installing packages with a specific ID and name.
 * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated.
 * @param {Function} fetchInstalledModuleDescription - Middleware function to fetch the description of the installed module.
 * @returns None
 */
moduleRouter.get(
  "/installPackages/id/:name",
  isAuthenticated,
  fetchInstalledModuleDescription
);

/**
 * Route handler for fetching search packages counts.
 * @param {string} "/searchPackagesCounts" - The route path for fetching search packages counts.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} fetchSearchPackagesCount - Handler function to fetch search packages count.
 * @returns None
 */
moduleRouter.get(
  "/searchPackagesCounts",
  isAuthenticated,
  fetchSearchPackagesCount
);

/**
 * Defines a route for searching packages by package name.
 * @param {string} "/searchPackages/:packageName" - The route path for searching packages.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} searchPackages - Handler function to search for packages.
 * @returns None
 */
moduleRouter.get(
  "/searchPackages/:packageName",
  isAuthenticated,
  searchPackages
);

/**
 * POST endpoint for installing packages in the Eco system.
 * @param {string} "/installPackages" - The route for installing packages.
 * @param {Function} isAuthenticated - Middleware function for authentication.
 * @param {Function} installEcoPackages - Handler function for installing Eco packages.
 * @returns None
 */
moduleRouter.post("/installPackages", isAuthenticated, installEcoPackages);

/**
 * Defines a POST route for importing packages in the Eco system.
 * @param {string} "/installPackages/import" - The route path for importing packages.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} importEcoPackages - Controller function to handle importing Eco packages.
 * @returns None
 */
moduleRouter.post(
  "/installPackages/import",
  isAuthenticated,
  importEcoPackages
);

/**
 * Patch route for installing packages.
 * @param {string} "/installPackages" - The route path for installing packages.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} upgradeDowngradePackage - Function to handle upgrading/downgrading packages.
 * @returns None
 */
moduleRouter.patch(
  "/installPackages",
  isAuthenticated,
  upgradeDowngradePackage
);

/**
 * Defines a route to handle the deletion of a specific package.
 * @param {string} "/installPackages/:packageName" - The route path for deleting a package.
 * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
 * @param {Function} removeEcoPackage - Handler function to remove the specified package.
 * @returns None
 */
moduleRouter.delete(
  "/installPackages/:packageName",
  isAuthenticated,
  removeEcoPackage
);

/**
 * Mounts the routes defined in moduleNodeRouter under the "/nodes" path in the moduleRouter.
 * @param {string} "/nodes" - The base path for the routes.
 * @param {Router} moduleNodeRouter - The router containing the node-related routes.
 * @returns None
 */
moduleRouter.use("/nodes", moduleNodeRouter.routes());
