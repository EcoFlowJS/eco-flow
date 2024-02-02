import { EcoRouter } from "../../../../service/EcoRouter";
import {
  getAllConfigs,
  getConfig,
  updateConfig,
} from "../../../controllers/config/config.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated";

const adminConfigRouter = EcoRouter.createRouter();
export default adminConfigRouter;

adminConfigRouter.get("/", isAuthenticated, getAllConfigs);
adminConfigRouter.get("/:config", isAuthenticated, getConfig);
adminConfigRouter.put("/", isAuthenticated, updateConfig);
