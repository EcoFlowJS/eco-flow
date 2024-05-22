import { EcoRouter } from "../../../../service/EcoRouter";
import uploadImportFile from "../../../controllers/setup/import/uploadImportFile.controller";

const setupImportRouter = EcoRouter.createRouter();
export default setupImportRouter;

setupImportRouter.post("/", uploadImportFile);
