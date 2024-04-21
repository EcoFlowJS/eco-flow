import {
  EcoAPIRouterBuilder,
  EcoAPIBuilder as IEcoAPIBuilder,
  Routes,
} from "@ecoflow/types";
import Router from "@koa/router";
import { DefaultContext, DefaultState } from "koa";

export class EcoAPIBuilder implements IEcoAPIBuilder {
  private routes: Routes[];
  constructor(routes: Routes[] = []) {
    this.routes = routes;
  }

  createGETRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this {
    if (Array.isArray(path))
      path.forEach((routePath) => {
        this.routes.push({
          path: routePath,
          type: "method",
          method: ["GET"],
          controller: middleware,
        });
      });
    else
      this.routes.push({
        path: path,
        type: "method",
        method: ["GET"],
        controller: middleware,
      });

    return this;
  }

  createHEADRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Router.Middleware<DefaultState, DefaultContext>[]
  ): this {
    if (Array.isArray(path))
      path.forEach((routePath) => {
        this.routes.push({
          path: routePath,
          type: "method",
          method: ["HEAD"],
          controller: middleware,
        });
      });
    else
      this.routes.push({
        path: path,
        type: "method",
        method: ["HEAD"],
        controller: middleware,
      });

    return this;
  }

  createOPTIONSRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Router.Middleware<DefaultState, DefaultContext, unknown>[]
  ): this {
    if (Array.isArray(path))
      path.forEach((routePath) => {
        this.routes.push({
          path: routePath,
          type: "method",
          method: ["OPTIONS"],
          controller: middleware,
        });
      });
    else
      this.routes.push({
        path: path,
        type: "method",
        method: ["OPTIONS"],
        controller: middleware,
      });

    return this;
  }

  createPUTRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Router.Middleware<DefaultState, DefaultContext, unknown>[]
  ): this {
    if (Array.isArray(path))
      path.forEach((routePath) => {
        this.routes.push({
          path: routePath,
          type: "method",
          method: ["PUT"],
          controller: middleware,
        });
      });
    else
      this.routes.push({
        path: path,
        type: "method",
        method: ["PUT"],
        controller: middleware,
      });

    return this;
  }

  createPATCHRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Router.Middleware<DefaultState, DefaultContext, unknown>[]
  ): this {
    if (Array.isArray(path))
      path.forEach((routePath) => {
        this.routes.push({
          path: routePath,
          type: "method",
          method: ["PATCH"],
          controller: middleware,
        });
      });
    else
      this.routes.push({
        path: path,
        type: "method",
        method: ["PATCH"],
        controller: middleware,
      });

    return this;
  }

  createPOSTRoute(
    path: string | RegExp | (string | RegExp)[],
    ...middleware: Router.Middleware<DefaultState, DefaultContext, unknown>[]
  ): this {
    if (Array.isArray(path))
      path.forEach((routePath) => {
        this.routes.push({
          path: routePath,
          type: "method",
          method: ["POST"],
          controller: middleware,
        });
      });
    else
      this.routes.push({
        path: path,
        type: "method",
        method: ["POST"],
        controller: middleware,
      });

    return this;
  }

  createDELETERoute(
    path: string | RegExp | (string | RegExp)[],
    ...middleware: Router.Middleware<DefaultState, DefaultContext, unknown>[]
  ): this {
    if (Array.isArray(path))
      path.forEach((routePath) => {
        this.routes.push({
          path: routePath,
          type: "method",
          method: ["DELETE"],
          controller: middleware,
        });
      });
    else
      this.routes.push({
        path: path,
        type: "method",
        method: ["DELETE"],
        controller: middleware,
      });

    return this;
  }

  createRouterRoute(
    path: string | RegExp | string[],
    router: Router<DefaultState, DefaultContext>
  ): this {
    if (Array.isArray(path))
      path.forEach((routePath) => {
        this.routes.push({
          path: routePath,
          type: "Router",
          router: router,
        });
      });
    else
      this.routes.push({
        path: path,
        type: "Router",
        router: router,
      });

    return this;
  }

  registerTo(router: Router): this {
    const { _ } = ecoFlow;
    this.routes.forEach((route) => {
      if (_.isEmpty(route.path)) return;
      if (_.isEmpty(route.type)) return;
      if (route.type === "method") {
        if (_.isEmpty(route.method)) return;
        if (typeof route.controller === "undefined") return;
        router.register(
          route.path,
          route.method!,
          route.controller!,
          route.opts
        );
      }

      if (route.type === "Router") {
        if (typeof route.router === "undefined") return;
        router.use(
          route.path,
          route.router.routes(),
          route.router.allowedMethods()
        );
      }
    });

    return this;
  }

  get route(): Routes[] {
    return this.routes;
  }

  static register(
    apiRouterBuilder: Omit<EcoAPIRouterBuilder, "initializeBuilder">
  ): void {
    const registerRoutes = (routes: Routes[]): void => {
      const { _, router } = ecoFlow;
      const { apiRouter } = router;
      if (_.isUndefined(apiRouter)) throw "Could not found api router.";

      if (apiRouter.stack.length > 0)
        apiRouter.stack.splice(0, apiRouter.stack.length);

      routes.forEach((route) => {
        const { path, type, method, controller, router, opts } = route;
        if (_.isUndefined(path) || _.isEmpty(path)) return;
        if (_.isUndefined(type) || _.isEmpty(type)) return;

        if (type === "method") {
          if (_.isUndefined(method) || _.isEmpty(method)) return;
          if (_.isUndefined(controller) || !_.isFunction(controller)) return;

          apiRouter.register(path, method, controller, opts);
        }

        if (type === "Router") {
          if (_.isUndefined(router) || _.isEmpty(router)) return;
          apiRouter.use(path, router.routes(), router.allowedMethods());
        }
      });
    };

    try {
      registerRoutes(apiRouterBuilder.routes);
    } catch (error) {
      throw error;
    }
  }
}
