import { EcoRouter } from "../../../../service/EcoRouter";
import {
  databaseValidator,
  processSetupController,
} from "../../../controllers/setup/blank";

const setupBlankRouter = EcoRouter.createRouter();
export default setupBlankRouter;

setupBlankRouter.post("/validateDB", databaseValidator);

setupBlankRouter.post("/", processSetupController);
