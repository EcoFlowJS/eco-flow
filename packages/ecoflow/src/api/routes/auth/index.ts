import { EcoRouter } from "../../../service/EcoRouter";
import userRouter from "./users";

const authRouter = EcoRouter.createRouter();
export default authRouter;

authRouter.get("/", (ctx) => (ctx.body = "Auth Router"));

authRouter.use("/users", userRouter.routes());
