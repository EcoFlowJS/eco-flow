import { EcoRouter } from "../../../service/EcoRouter";

const authRouter = EcoRouter.createRouter();
export default authRouter;

authRouter.get("/", (ctx) => (ctx.body = "Auth Router"));
