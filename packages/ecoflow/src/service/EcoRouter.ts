import { homedir } from "os";
import path from "path";
import fs from "fs";
import { EcoServer, EcoRouter as IEcoRouter } from "@eco-flow/types";
import { DefaultState, DefaultContext } from "koa";
import KoaRouter, { RouterOptions } from "@koa/router";
import mount from "koa-mount";
import staticServe from "koa-static";

export class EcoRouter implements IEcoRouter {
  systemRouter: KoaRouter<DefaultState, DefaultContext>;
  apiRouter: KoaRouter<DefaultState, DefaultContext>;

  constructor(svr: EcoServer) {
    const defaultRouter = this.createRouter();

    let {
      userDir,
      systemRouterOptions,
      apiRouterOptions,
      httpStatic,
      httpStaticRoot,
    } = ecoFlow.config._config;

    if (ecoFlow._.isEmpty(systemRouterOptions)) {
      systemRouterOptions = {};
      systemRouterOptions.prefix = "/systemAPI";
    }
    if (ecoFlow._.isEmpty(apiRouterOptions)) {
      apiRouterOptions = {};
      apiRouterOptions.prefix = "/api";
    }
    if (!ecoFlow._.has(systemRouterOptions, "prefix"))
      systemRouterOptions.prefix = "/systemAPI";
    if (!ecoFlow._.has(apiRouterOptions, "prefix"))
      apiRouterOptions.prefix = "/api";

    this.systemRouter = this.createRouter(systemRouterOptions);
    this.apiRouter = this.createRouter(apiRouterOptions);

    defaultRouter.get("/", (ctx) => ctx.redirect("/admin"));

    if (ecoFlow._.isEmpty(httpStatic)) httpStatic = "/public";

    if (typeof httpStatic === "string") {
      const baseDir = ecoFlow._.isEmpty(userDir)
        ? process.env.userDir || homedir().replace(/\\/g, "/") + "/.ecoflow"
        : userDir;
      let root: string = path.join(baseDir!, "public");
      if (!fs.existsSync(root)) fs.mkdirSync(root, { recursive: true });
      if (
        !ecoFlow._.isEmpty(httpStaticRoot) &&
        ecoFlow._.isString(httpStaticRoot)
      )
        root = httpStaticRoot;

      if (!httpStatic.startsWith("/")) httpStatic = "/" + httpStatic.trim();

      svr.use(mount(httpStatic, staticServe(root)));
    }

    if (Array.isArray(httpStatic)) {
      httpStatic.forEach((obj) => {
        if (ecoFlow._.isEmpty(obj.path.trim())) return;
        if (!fs.existsSync(obj.root))
          fs.mkdirSync(obj.root, { recursive: true });
        if (!obj.path.startsWith("/")) obj.path = "/" + obj.path.trim();
        svr.use(mount(obj.path, staticServe(obj.root)));
      });
    }

    ecoFlow.helper.loadEditor();
    svr.use(this.systemRouter.routes()).use(this.systemRouter.allowedMethods());
    svr.use(this.apiRouter.routes()).use(this.apiRouter.allowedMethods());
    svr.use(defaultRouter.routes()).use(defaultRouter.allowedMethods());
    svr.use((ctx) => {
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
   * Creates new router instance.
   * @param opt {RouterOptions} Options to configure the router with the given options object.
   * @returns {KoaRouter}
   */
  createRouter(opt?: RouterOptions): KoaRouter {
    return new KoaRouter(opt);
  }
}
