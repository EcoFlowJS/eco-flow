import Router from "@koa/router";

const setupRouter = new Router();

setupRouter.get("/", (ctx) => (ctx.body = "Hello World"));

export default setupRouter;
