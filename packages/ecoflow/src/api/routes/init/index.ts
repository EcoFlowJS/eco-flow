import { EcoRouter } from "../../../service/EcoRouter";
import { initStatus } from "../../controllers/init/init.controller";

const initRouter = EcoRouter.createRouter();
export default initRouter;

initRouter.get("/status", initStatus);
