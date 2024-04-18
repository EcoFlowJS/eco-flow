import { EcoRouter } from "../../../service/EcoRouter";
import deployFlowConfiguration from "../../controllers/flow/deployFlowConfiguration.controller";
import getFlows from "../../controllers/flow/getFlows.controller";
import getSettings from "../../controllers/flow/getSettings.controller";
import updateSettings from "../../controllers/flow/updateSettings.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const flowRouter = EcoRouter.createRouter();
export default flowRouter;

flowRouter.get("/", isAuthenticated, getFlows);
flowRouter.get("/id/:flowName", isAuthenticated, getFlows);
flowRouter.get("/settings", isAuthenticated, getSettings);

flowRouter.post("/settings", isAuthenticated, updateSettings);

flowRouter.post("/deploy", isAuthenticated, deployFlowConfiguration);
