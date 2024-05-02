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

moduleRouter.get("/", isAuthenticated, fetchModule);
moduleRouter.get("/id/:moduleID", isAuthenticated, fetchModule);

moduleRouter.get("/installPackages", isAuthenticated, fetchInstalledModule);
moduleRouter.get(
  "/installPackages/id/:name",
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

moduleRouter.post("/installPackages", isAuthenticated, installEcoPackages);
moduleRouter.post(
  "/installPackages/import",
  isAuthenticated,
  importEcoPackages
);

moduleRouter.patch(
  "/installPackages",
  isAuthenticated,
  upgradeDowngradePackage
);

moduleRouter.delete(
  "/installPackages/:packageName",
  isAuthenticated,
  removeEcoPackage
);

//node router
moduleRouter.use("/nodes", moduleNodeRouter.routes());
