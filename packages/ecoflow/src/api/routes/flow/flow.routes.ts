import { EcoRouter } from "../../../service/EcoRouter";
import getFlows from "../../controllers/flow/getFlows.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const flowRouter = EcoRouter.createRouter();
export default flowRouter;

flowRouter.get("/", isAuthenticated, getFlows);
flowRouter.get("/:flowName", isAuthenticated, getFlows);
