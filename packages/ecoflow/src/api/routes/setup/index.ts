import { EcoRouter } from "../../../service/EcoRouter";

const setupRouter = EcoRouter.createRouter();
export default setupRouter;

setupRouter.get(["/", "/home"], (ctx) => ctx);
