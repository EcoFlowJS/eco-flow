import { EcoRouter } from "../../../service/EcoRouter";
import adminConfigRouter from "./config/config";
import environmentRouter from "./environment/environment";

const adminRouter = EcoRouter.createRouter();
export default adminRouter;

adminRouter.get("/", (ctx) => (ctx.body = "adminRouter"));
adminRouter.use("/config", adminConfigRouter.routes());
adminRouter.use("/environment", environmentRouter.routes());
