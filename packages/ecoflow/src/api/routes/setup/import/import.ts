import { EcoRouter } from "../../../../service/EcoRouter";
import {
  processImport,
  uploadImportFileController,
} from "../../../controllers/setup/import";

const setupImportRouter = EcoRouter.createRouter();
export default setupImportRouter;

setupImportRouter.post("/", uploadImportFileController);
setupImportRouter.patch("/", processImport);
