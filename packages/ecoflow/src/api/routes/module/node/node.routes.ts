import { EcoRouter } from "../../../../service/EcoRouter";
import getNodes from "../../../controllers/nodes/getNodes.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";

const moduleNodeRouter = EcoRouter.createRouter();
export default moduleNodeRouter;

moduleNodeRouter.get("/", isAuthenticated, getNodes);
moduleNodeRouter.get("/id/:nodeId", isAuthenticated, getNodes);
