import { EcoRouter } from "../../../service/EcoRouter.js";
import exportController from "../../controllers/export/exportController.controller.js";
import isAuthenticated from "../../controllers/user/isAuthenticated.controller.js";

const exportRouter = EcoRouter.createRouter();
export default exportRouter;

exportRouter.post("/", isAuthenticated, exportController);
