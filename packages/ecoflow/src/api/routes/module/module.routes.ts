import { EcoRouter } from "../../../service/EcoRouter";
import fetchInstalledModule from "../../controllers/module/fetchInstalledModule.controller";
import fetchInstalledModuleDescription from "../../controllers/module/fetchInstalledModuleDescription.controller";
import fetchModule from "../../controllers/module/fetchModule.controller";
import fetchSearchPackagesCount from "../../controllers/module/fetchSearchPackagesCount.controller";
import installEcoPackages from "../../controllers/module/installEcoPackages.controller";
import searchPackages from "../../controllers/module/searchPackages.controller";
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

//node router
moduleRouter.use("/nodes", moduleNodeRouter.routes());
