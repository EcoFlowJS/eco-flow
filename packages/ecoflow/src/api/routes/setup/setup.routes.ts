import { EcoRouter } from "../../../service/EcoRouter";
import setupBlankRouter from "./blank/blank.routes";
import setupImportRouter from "./import/import.routes";

const setupRouter = EcoRouter.createRouter();
export default setupRouter;

setupRouter.use("/blank", setupBlankRouter.routes());
setupRouter.use("/import", setupImportRouter.routes());
