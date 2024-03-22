import { EcoRouter } from "../../../../service/EcoRouter";
import commitEnvs from "../../../controllers/environment/commitEnvs.controller";
import getEnv from "../../../controllers/environment/getEnv.controller";
import getSystemEnv from "../../../controllers/environment/getSystemEnv.controller";
import getUserEnv from "../../../controllers/environment/getUserEnv.controller";
import isAuthenticated from "../../../controllers/user/isAuthenticated.controller";

const environmentRouter = EcoRouter.createRouter();
export default environmentRouter;

environmentRouter.get("/envs", isAuthenticated, getEnv);
environmentRouter.get("/env/:envID", isAuthenticated, getEnv);

environmentRouter.get("/userEnvs", isAuthenticated, getUserEnv);
environmentRouter.get("/userEnv/:envID", isAuthenticated, getUserEnv);

environmentRouter.get("/systemEnvs", isAuthenticated, getSystemEnv);
environmentRouter.get("/systemEnv/:envID", isAuthenticated, getSystemEnv);

environmentRouter.post("/envs", isAuthenticated, commitEnvs);
