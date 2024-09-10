import { EcoRouter } from "../../../../service/EcoRouter.js";
import uploadImportFile from "../../../controllers/setup/import/uploadImportFile.controller.js";

const setupImportRouter = EcoRouter.createRouter();
export default setupImportRouter;

setupImportRouter.post("/", uploadImportFile);
