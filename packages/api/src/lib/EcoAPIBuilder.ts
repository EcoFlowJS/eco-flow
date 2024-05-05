import {
  EcoAPIRouterBuilder,
  EcoAPIBuilder as IEcoAPIBuilder,
  Routes,
} from "@ecoflow/types";
import Router from "@koa/router";
import { DefaultContext, DefaultState } from "koa";

/**
 * A class that helps in building and registering routes for an API using various HTTP methods.
 */
export class EcoAPIBuilder implements IEcoAPIBuilder {
  private routes: Routes[];
  constructor(routes: Routes[] = []) {
    this.routes = routes;
  }

  /**
   * Creates a GET route with the specified path and middleware.
   * @param {string | RegExp | Array<string | RegExp>} path - The path or paths for the route.
   * @param {Array<Router.Middleware<DefaultState, DefaultContext>>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class to allow for method chaining.
   */
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

  /**
   * Creates a HEAD route with the specified path and middleware.
   * @param {string | RegExp | Array<string | RegExp>} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class with the new HEAD route added.
   */
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

  /**
   * Creates an OPTIONS route with the specified path and middleware.
   * @param {string | RegExp | Array<string | RegExp>} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext, unknown>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class to allow method chaining.
   */
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

  /**
   * Creates a PUT route with the specified path and middleware.
   * @param {string | RegExp | Array<string | RegExp>} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext, unknown>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class to allow for method chaining.
   */
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

  /**
   * Creates a PATCH route with the specified path and middleware.
   * @param {string | RegExp | Array<string | RegExp>} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext, unknown>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class to allow for method chaining.
   */
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

  /**
   * Creates a POST route with the specified path and middleware.
   * @param {string | RegExp | (string | RegExp)[]} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext, unknown>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class to allow for method chaining.
   */
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

  /**
   * Creates a DELETE route with the specified path and middleware.
   * @param {string | RegExp | (string | RegExp)[]} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext, unknown>} middleware - The middleware functions for the route.
   * @returns {this} The instance of the class with the new DELETE route added.
   */
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

  /**
   * Adds a new route to the router with the specified path and router.
   * @param {string | RegExp | string[]} path - The path or paths for the route.
   * @param {Router<DefaultState, DefaultContext>} router - The router to be associated with the path.
   * @returns {this} The updated router instance with the new route added.
   */
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

  /**
   * Registers routes to the provided router based on the configuration set in this instance.
   * @param {Router} router - The router to register routes to.
   * @returns {this} The instance of the class with routes registered to the router.
   */
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

  /**
   * Getter method to retrieve the routes array.
   * @returns {Routes[]} - An array of Routes objects.
   */
  get route(): Routes[] {
    return this.routes;
  }

  /**
   * Registers routes based on the provided API router builder configuration.
   * @param {Omit<EcoAPIRouterBuilder, "initializeBuilder">} apiRouterBuilder - The API router builder configuration.
   * @returns None
   */
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

    registerRoutes(apiRouterBuilder.routes);
  }
}
