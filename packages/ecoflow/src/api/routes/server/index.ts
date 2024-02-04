import { EcoRouter } from "../../../service/EcoRouter";

const serverRouter = EcoRouter.createRouter();
export default serverRouter;

serverRouter.post("/", (ctx) => (ctx.body = ctx.request.body));
