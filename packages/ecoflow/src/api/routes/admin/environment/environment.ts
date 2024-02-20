import { EcoRouter } from "../../../../service/EcoRouter";
import {
  getAllEnvs,
  getEnv,
  getSystemEnvs,
  getSystemEnv,
  getUserEnv,
  getUserEnvs,
  commitEnvs,
} from "../../../controllers/environment/environment.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated";

const environmentRouter = EcoRouter.createRouter();
export default environmentRouter;

environmentRouter.get("/envs", isAuthenticated, getAllEnvs);
environmentRouter.get("/env/:envID", isAuthenticated, getEnv);

environmentRouter.get("/userEnvs", isAuthenticated, getUserEnvs);
environmentRouter.get("/userEnv/:envID", isAuthenticated, getUserEnv);

environmentRouter.get("/systemEnvs", isAuthenticated, getSystemEnvs);
environmentRouter.get("/systemEnv/:envID", isAuthenticated, getSystemEnv);

environmentRouter.post("/envs", isAuthenticated, commitEnvs);
