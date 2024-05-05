import Router from "@koa/router";
import { DefaultContext, DefaultState } from "koa";

/**
 * Defines an array type that can only contain the HTTP methods: HEAD, OPTIONS, GET, PUT, PATCH, POST, DELETE.
 */
export type methods = (
  | "HEAD"
  | "OPTIONS"
  | "GET"
  | "PUT"
  | "PATCH"
  | "POST"
  | "DELETE"
)[];

/**
 * Interface for defining routes in an application.
 * @interface Routes
 * @property {string | RegExp} path - The path or regular expression for the route.
 * @property {"method" | "Router"} type - The type of route, either "method" or "Router".
 * @property {methods} [method] - The HTTP method for the route.
 * @property {Router.Middleware<DefaultState, DefaultContext> | Array<Router.Middleware<DefaultState, DefaultContext>>} [controller] - The controller function or array of controller functions for the route.
 * @property {Router<DefaultState, DefaultContext>} [router] - The router for nested routes.
 * @property {Router.LayerOptions}
 */
export interface Routes {
  path: string | RegExp;
  type: "method" | "Router";
  method?: methods;
  controller?:
    | Router.Middleware<DefaultState, DefaultContext>
    | Array<Router.Middleware<DefaultState, DefaultContext>>;
  router?: Router<DefaultState, DefaultContext>;
  opts?: Router.LayerOptions;
}
