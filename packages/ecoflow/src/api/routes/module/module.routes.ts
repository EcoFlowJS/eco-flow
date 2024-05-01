import { EcoRouter } from "../../../service/EcoRouter";
import fetchInstalledModule from "../../controllers/module/fetchInstalledModule.controller";
import fetchInstalledModuleDescription from "../../controllers/module/fetchInstalledModuleDescription.controller";
import fetchModule from "../../controllers/module/fetchModule.controller";
import fetchSearchPackagesCount from "../../controllers/module/fetchSearchPackagesCount.controller";
import searchPackages from "../../controllers/module/searchPackages.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";
import moduleNodeRouter from "./node/node.routes";

const moduleRouter = EcoRouter.createRouter();
export default moduleRouter;

moduleRouter.get("/", isAuthenticated, fetchModule);
moduleRouter.get("/id/:moduleID", isAuthenticated, fetchModule);

moduleRouter.get("/installedPackages", isAuthenticated, fetchInstalledModule);
moduleRouter.get(
  "/installedPackages/id/:name",
  isAuthenticated,
  fetchInstalledModuleDescription
);
moduleRouter.get(
  "/searchPackagesCounts",
  isAuthenticated,
  fetchSearchPackagesCount
);
moduleRouter.get(
  "/searchPackages/:packageName",
  isAuthenticated,
  searchPackages
);

//node router
moduleRouter.use("/nodes", moduleNodeRouter.routes());
