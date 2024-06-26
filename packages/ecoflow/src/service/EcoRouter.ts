import { homedir } from "os";
import path from "path";
import fs from "fs";
import { EcoServer, EcoRouter as IEcoRouter } from "@ecoflow/types";
import { DefaultState, DefaultContext } from "koa";
import KoaRouter, { RouterOptions } from "@koa/router";
import mount from "koa-mount";
import staticServe from "koa-static";

/**
 * Class representing an EcoRouter that implements EcoRouter interface.
 */
export class EcoRouter implements IEcoRouter {
  /**
   * Represents a KoaRouter instance that handles system routes.
   * @type {KoaRouter<DefaultState, DefaultContext> | undefined}
   */
  systemRouter: KoaRouter<DefaultState, DefaultContext> | undefined;

  /**
   * The API router instance for handling API routes in a Koa application.
   * @type {KoaRouter<DefaultState, DefaultContext>}
   */
  apiRouter!: KoaRouter<DefaultState, DefaultContext>;

  /**
   * Initializes the router for the EcoServer instance.
   * @param {EcoServer} svr - The EcoServer instance to initialize the router for.
   * @returns None
   */
  initRouter(svr: EcoServer) {
    const { config, _ } = ecoFlow;
    const defaultRouter = EcoRouter.createRouter();

    let { userDir, apiRouterOptions, httpStatic, httpStaticRoot } =
      config._config;

    if (_.isEmpty(apiRouterOptions)) {
      apiRouterOptions = {};
      apiRouterOptions.prefix = "/api";
    }
    if (!_.has(apiRouterOptions, "prefix")) apiRouterOptions.prefix = "/api";

    this.apiRouter = EcoRouter.createRouter(apiRouterOptions);

    if (_.isEmpty(httpStatic)) httpStatic = "/public";

    if (typeof httpStatic === "string") {
      const baseDir = _.isEmpty(userDir)
        ? process.env.userDir || homedir().replace(/\\/g, "/") + "/.ecoflow"
        : userDir;
      let root: string = path.join(baseDir!, "public");
      if (!fs.existsSync(root)) fs.mkdirSync(root, { recursive: true });
      if (!_.isEmpty(httpStaticRoot) && _.isString(httpStaticRoot))
        root = httpStaticRoot;

      if (!httpStatic.startsWith("/")) httpStatic = "/" + httpStatic.trim();

      svr.use(mount(httpStatic, staticServe(root)));
    }

    if (Array.isArray(httpStatic)) {
      httpStatic.forEach((obj) => {
        if (_.isEmpty(obj.path.trim())) return;
        if (!fs.existsSync(obj.root))
          fs.mkdirSync(obj.root, { recursive: true });
        if (!obj.path.startsWith("/")) obj.path = "/" + obj.path.trim();
        svr.use(mount(obj.path, staticServe(obj.root)));
      });
    }

    svr.use(this.apiRouter.routes()).use(this.apiRouter.allowedMethods());
    svr.use(defaultRouter.routes()).use(defaultRouter.allowedMethods());
    svr.use(async (ctx, next) => {
      await next();
      switch (ctx.status) {
        case 404:
          ctx.body = { error: "Unknown API request." };
          break;
        default:
          break;
      }
    });
  }

  /**
   * Creates a new instance of KoaRouter with the provided options.
   * @param {RouterOptions} [opt] - Optional options to configure the router.
   * @returns {KoaRouter} - A new instance of KoaRouter.
   */
  static createRouter(opt?: RouterOptions): KoaRouter {
    return new KoaRouter(opt);
  }
}
