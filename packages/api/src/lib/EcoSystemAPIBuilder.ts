import {
  EcoSystemAPIBuilder as IEcoSystemAPIBuilder,
  Routes,
} from "@eco-flow/types";
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
   * Create a GET request for the specified route and parameters.
   * @param path {string | RegExp | Array<string | RegExp>} The path of the api endpoint.
   * @param middleware {Function | Array<Function>} The middleware function to execute when the endpoint is requested from the API endpoint.
   * @returns { EcoSystemAPIBuilder } instance of EAcoSystemAPIBuilder.
   * @memberof EcoSystemAPIBuilder
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
   * Create a HEAD request for the specified route and parameters.
   * @param path {string | RegExp | Array<string | RegExp>} The path of the api endpoint.
   * @param middleware {Function | Array<Function>} The middleware function to execute when the endpoint is requested from the API endpoint.
   * @returns { EcoSystemAPIBuilder } instance of EAcoSystemAPIBuilder.
   * @memberof EcoSystemAPIBuilder
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
   * Create a OPTIONS request for the specified route and parameters.
   * @param path {string | RegExp | Array<string | RegExp>} The path of the api endpoint.
   * @param middleware {Function | Array<Function>} The middleware function to execute when the endpoint is requested from the API endpoint.
   * @returns { EcoSystemAPIBuilder } instance of EAcoSystemAPIBuilder.
   * @memberof EcoSystemAPIBuilder
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
   * Create a PUT request for the specified route and parameters.
   * @param path {string | RegExp | Array<string | RegExp>} The path of the api endpoint.
   * @param middleware {Function | Array<Function>} The middleware function to execute when the endpoint is requested from the API endpoint.
   * @returns { EcoSystemAPIBuilder } instance of EAcoSystemAPIBuilder.
   * @memberof EcoSystemAPIBuilder
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
   * Create a PATCH request for the specified route and parameters.
   * @param path {string | RegExp | Array<string | RegExp>} The path of the api endpoint.
   * @param middleware {Function | Array<Function>} The middleware function to execute when the endpoint is requested from the API endpoint.
   * @returns { EcoSystemAPIBuilder } instance of EAcoSystemAPIBuilder.
   * @memberof EcoSystemAPIBuilder
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
   * Create a POST request for the specified route and parameters.
   * @param path {string | RegExp | Array<string | RegExp>} The path of the api endpoint.
   * @param middleware {Function | Array<Function>} The middleware function to execute when the endpoint is requested from the API endpoint.
   * @returns { EcoSystemAPIBuilder } instance of EAcoSystemAPIBuilder.
   * @memberof EcoSystemAPIBuilder
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
   * Create a DELETE request for the specified route and parameters.
   * @param path {string | RegExp | Array<string | RegExp>} The path of the api endpoint.
   * @param middleware {Function | Array<Function>} The middleware function to execute when the endpoint is requested from the API endpoint.
   * @returns { EcoSystemAPIBuilder } instance of EAcoSystemAPIBuilder.
   * @memberof EcoSystemAPIBuilder
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
   * Creates a new route for the specified path.
   * @param path {string | RegExp | Array<string | RegExp>} The path of the api endpoint.
   * @param router {KoaRouter} External router to merge to the route.
   * @returns { EcoSystemAPIBuilder } instance of EAcoSystemAPIBuilder.
   * @memberof EcoSystemAPIBuilder
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
   * Registers a routes to a specific router instance in the system.
   * @param router {KoaRouter} Router to where the routes is to be applied.
   * @returns { EcoSystemAPIBuilder } instance of EAcoSystemAPIBuilder.
   * @memberof EcoSystemAPIBuilder
   */
  registerTo(router: Router): this {
    this.routes.forEach((route) => {
      if (ecoFlow._.isEmpty(route.path)) return;
      if (ecoFlow._.isEmpty(route.type)) return;
      if (route.type === "method") {
        if (ecoFlow._.isEmpty(route.method)) return;
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
   * @returns { Routes[] } returns a list of routes.
   * @memberof EcoSystemAPIBuilder
   */
  get route(): Routes[] {
    return this.routes;
  }

  /**
   * Registers a routes to the System API Router.
   * @param routes { Routes[] } List of routes to be registered in the System Api Router.
   * @memberof EcoSystemAPIBuilder
   */
  static register(routes: Routes[]): void {
    const { systemRouter } = ecoFlow.router;
    if (ecoFlow._.isUndefined(systemRouter)) return;
    routes.forEach((route) => {
      if (ecoFlow._.isEmpty(route.path)) return;
      if (ecoFlow._.isEmpty(route.type)) return;
      if (route.type === "method") {
        if (ecoFlow._.isEmpty(route.method)) return;
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
