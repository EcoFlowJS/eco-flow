import {
  EcoSystemAPIBuilder as IEcoSystemAPIBuilder,
  Routes,
} from "@ecoflow/types";
import Router from "@koa/router";
import { DefaultContext, DefaultState } from "koa";

/**
 * Creates a routes configuration object used to configure the routes for the application api endpoint.
 * @constructor Initial routes array for the route configuration.
 * @param routes { Routes[] } The routes to configure or empty array.
 */
export class EcoSystemAPIBuilder implements IEcoSystemAPIBuilder {
  private routes: Routes[];
  constructor(routes: Routes[] = []) {
    this.routes = routes;
  }

  /**
   * Creates a GET route with the specified path and middleware.
   * @param {string | RegExp | Array<string | RegExp>} path - The path or paths for the route.
   * @param {Array<Router.Middleware<DefaultState, DefaultContext>>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class with the new GET route added.
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
   * @param {...Router.Middleware<DefaultState, DefaultContext>[]} middleware - The middleware functions to be executed for the route.
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
   * @returns {this} The instance of the class with the added OPTIONS route.
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
   * @returns {this} The instance of the class with the PUT route added.
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
   * @returns {this} The instance of the class with the POST route added.
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
   * @param {...Router.Middleware<DefaultState, DefaultContext, unknown>} middleware - The middleware functions to be executed for the route.
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
   * Creates a new route in the router with the specified path and router.
   * @param {string | RegExp | string[]} path - The path or paths for the route.
   * @param {Router<DefaultState, DefaultContext>} router - The router to be associated with the route.
   * @returns {this} The instance of the router with the new route added.
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
   * Registers routes to the provided router based on the configuration set in this.routes.
   * @param {Router} router - The router object to register routes to.
   * @returns {this} The current instance of the class.
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
   * Registers the provided routes with the system router.
   * @param {Routes[]} routes - An array of route objects to register.
   * @returns None
   */
  static register(routes: Routes[]): void {
    const { _, router } = ecoFlow;
    const { systemRouter } = router;
    if (_.isUndefined(systemRouter)) return;
    routes.forEach((route) => {
      if (_.isEmpty(route.path)) return;
      if (_.isEmpty(route.type)) return;
      if (route.type === "method") {
        if (_.isEmpty(route.method)) return;
        if (typeof route.controller === "undefined") return;
        systemRouter.register(
          route.path,
          route.method!,
          route.controller!,
          route.opts
        );
      }

      if (route.type === "Router") {
        if (typeof route.router === "undefined") return;
        systemRouter.use(
          route.path,
          route.router.routes(),
          route.router.allowedMethods()
        );
      }
    });
  }
}
