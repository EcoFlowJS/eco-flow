import { EcoRouter } from "../../../../service/EcoRouter";
import getConfigs from "../../../controllers/config/getConfigs.controller";
import updateConfig from "../../../controllers/config/updateConfig.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";

const adminConfigRouter = EcoRouter.createRouter();
export default adminConfigRouter;

adminConfigRouter.get("/", isAuthenticated, getConfigs);
adminConfigRouter.get("/:configID", isAuthenticated, getConfigs);
adminConfigRouter.put("/", isAuthenticated, updateConfig);
