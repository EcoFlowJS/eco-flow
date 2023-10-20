import { EcoServer, EcoRouter as IEcoRouter } from "@eco-flow/types";
import KoaRouter, { RouterOptions } from "@koa/router";
import { DefaultState, DefaultContext } from "koa";

export class EcoRouter implements IEcoRouter {
  systemRouter: KoaRouter<DefaultState, DefaultContext>;
  apiRouter: KoaRouter<DefaultState, DefaultContext>;

  constructor(svr: EcoServer) {
    const defaultRouter = this.createRouter();
    let config = ecoFlow.config._config;
    let configSystem: RouterOptions = { ...config.systemRouterOptions };
    let configAPI: RouterOptions = { ...config.apiRouterOptions };

    if (ecoFlow._.isEmpty(configSystem)) configSystem.prefix = "/system";
    if (ecoFlow._.isEmpty(configAPI)) configAPI.prefix = "/api";
    if (!ecoFlow._.has(configSystem, "prefix")) configSystem.prefix = "/system";
    if (!ecoFlow._.has(configAPI, "prefix")) configAPI.prefix = "/api";

    this.systemRouter = this.createRouter(configSystem);
    this.apiRouter = this.createRouter(configAPI);
    defaultRouter.all("(.*)", (ctx) => {
      ctx.body = { error: "Unknown API request." };
      ctx.status = 404;
    });

    svr.use(this.systemRouter.routes()).use(this.systemRouter.allowedMethods());
    svr.use(this.apiRouter.routes()).use(this.apiRouter.allowedMethods());
    svr.use(defaultRouter.routes()).use(defaultRouter.allowedMethods());
  }

  /**
   * Creates new router instance.
   * @param opt {RouterOptions} Options to configure the router with the given options object.
   * @returns {KoaRouter}
   */
  createRouter(opt?: RouterOptions): KoaRouter {
    return new KoaRouter(opt);
  }
}
