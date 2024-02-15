import { EcoRouter } from "../../../service/EcoRouter";
import setupBlankRouter from "./blank/blank";
import setupImportRouter from "./import/import";

const setupRouter = EcoRouter.createRouter();
export default setupRouter;

setupRouter.use("/blank", setupBlankRouter.routes());
setupRouter.use("/import", setupImportRouter.routes());
