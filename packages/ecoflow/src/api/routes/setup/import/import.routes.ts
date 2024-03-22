import { EcoRouter } from "../../../../service/EcoRouter";
import processImport from "../../../controllers/setup/import/processImport.controller";
import uploadImportFile from "../../../controllers/setup/import/uploadImportFile.controller";

const setupImportRouter = EcoRouter.createRouter();
export default setupImportRouter;

setupImportRouter.post("/", uploadImportFile);
setupImportRouter.patch("/", processImport);
