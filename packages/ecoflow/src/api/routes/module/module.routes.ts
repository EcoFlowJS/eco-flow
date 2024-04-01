import { EcoRouter } from "../../../service/EcoRouter";
import fetchModule from "../../controllers/module/fetchModule.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const moduleRouter = EcoRouter.createRouter();
export default moduleRouter;

moduleRouter.get("/", isAuthenticated, fetchModule);
moduleRouter.get("/:moduleID", isAuthenticated, fetchModule);
