import { EcoRouter } from "../../../service/EcoRouter";
import adminConfigRouter from "./config";

const adminRouter = EcoRouter.createRouter();
export default adminRouter;

adminRouter.get("/", (ctx) => (ctx.body = "adminRouter"));
adminRouter.use("/config", adminConfigRouter.routes());
