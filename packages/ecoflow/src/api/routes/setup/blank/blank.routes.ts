import { EcoRouter } from "../../../../service/EcoRouter";
import databaseValidatorBlank from "../../../controllers/setup/blank/databaseValidatorBlank.controller";
import processSetupBlank from "../../../controllers/setup/blank/processSetupBlank.controller";

const setupBlankRouter = EcoRouter.createRouter();
export default setupBlankRouter;

setupBlankRouter.post("/validateDB", databaseValidatorBlank);

setupBlankRouter.post("/", processSetupBlank);
