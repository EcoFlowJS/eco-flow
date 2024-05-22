import { EcoRouter } from "../../../service/EcoRouter";
import exportController from "../../controllers/export/exportController.controller";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller";

const exportRouter = EcoRouter.createRouter();
export default exportRouter;

exportRouter.post("/", isAuthenticated, exportController);
