import Router from "@koa/router";
import { DefaultContext, DefaultState } from "koa";
import { Routes } from "./common";

/**
 * Interface for building API routes using the EcoAPIBuilder.
 */
export interface EcoAPIBuilder {
  /**
   * Creates a GET route with the specified path and middleware.
   * @param {string | RegExp | Array<string | RegExp>} path - The path or paths for the route.
   * @param {Array<Router.Middleware<DefaultState, DefaultContext>>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class to allow for method chaining.
   */
  createGETRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  /**
   * Creates a HEAD route with the specified path and middleware.
   * @param {string | RegExp | Array<string | RegExp>} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class with the new HEAD route added.
   */
  createHEADRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  /**
   * Creates an OPTIONS route with the specified path and middleware.
   * @param {string | RegExp | Array<string | RegExp>} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext, unknown>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class to allow method chaining.
   */
  createOPTIONSRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  /**
   * Creates a PUT route with the specified path and middleware.
   * @param {string | RegExp | Array<string | RegExp>} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext, unknown>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class to allow for method chaining.
   */
  createPUTRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  /**
   * Creates a PATCH route with the specified path and middleware.
   * @param {string | RegExp | Array<string | RegExp>} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext, unknown>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class to allow for method chaining.
   */
  createPATCHRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  /**
   * Creates a POST route with the specified path and middleware.
   * @param {string | RegExp | (string | RegExp)[]} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext, unknown>} middleware - The middleware functions to be executed for the route.
   * @returns {this} The instance of the class to allow for method chaining.
   */
  createPOSTRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  /**
   * Creates a DELETE route with the specified path and middleware.
   * @param {string | RegExp | (string | RegExp)[]} path - The path or paths for the route.
   * @param {...Router.Middleware<DefaultState, DefaultContext, unknown>} middleware - The middleware functions for the route.
   * @returns {this} The instance of the class with the new DELETE route added.
   */
  createDELETERoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  /**
   * Adds a new route to the router with the specified path and router.
   * @param {string | RegExp | string[]} path - The path or paths for the route.
   * @param {Router<DefaultState, DefaultContext>} router - The router to be associated with the path.
   * @returns {this} The updated router instance with the new route added.
   */
  createRouterRoute(
    path: string | string[] | RegExp,
    router: Router<DefaultState, DefaultContext>
  ): this;

  /**
   * Registers routes to the provided router based on the configuration set in this instance.
   * @param {Router} router - The router to register routes to.
   * @returns {this} The instance of the class with routes registered to the router.
   */
  registerTo(router: Router): this;

  /**
   * Getter method to retrieve the routes array.
   * @returns {Routes[]} - An array of Routes objects.
   */
  get route(): Routes[];
}
