import { baseController } from "../../controller/setup/setup.base.controller";
import { EcoRouter } from "../../../service/EcoRouter";

const setupRouter = EcoRouter.createRouter();
export default setupRouter;

setupRouter.get(["/", "/home"], baseController);
