import { EcoRouter } from "../../../service/EcoRouter";
import adminConfigRouter from "./config/config.routes";
import environmentRouter from "./environment/environment.routes";
import adminUsersRouter from "./users/users.routes";

const adminRouter = EcoRouter.createRouter();
export default adminRouter;

adminRouter.get("/", (ctx) => (ctx.body = "adminRouter"));
adminRouter.use("/config", adminConfigRouter.routes());
adminRouter.use("/environment", environmentRouter.routes());
adminRouter.use("/users", adminUsersRouter.routes());
