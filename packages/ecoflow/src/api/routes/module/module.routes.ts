import { EcoRouter } from "../../../service/EcoRouter";
import fetchModule from "../../controllers/module/fetchModule.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";
import moduleNodeRouter from "./node/node.routes";

const moduleRouter = EcoRouter.createRouter();
export default moduleRouter;

moduleRouter.get("/", isAuthenticated, fetchModule);
moduleRouter.get("/id/:moduleID", isAuthenticated, fetchModule);

//node router
moduleRouter.use("/nodes", moduleNodeRouter.routes());
