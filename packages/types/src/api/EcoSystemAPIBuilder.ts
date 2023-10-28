import Router from "@koa/router";
import { DefaultContext, DefaultState } from "koa";
import { methods } from "./methods";

export interface EcoSystemAPIBuilder {
  createGETRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  createHEADRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  createOPTIONSRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  createPUTRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  createPATCHRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  createPOSTRoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  createDELETERoute(
    path: string | RegExp | Array<string | RegExp>,
    ...middleware: Array<Router.Middleware<DefaultState, DefaultContext>>
  ): this;

  createRouterRoute(
    path: string | string[] | RegExp,
    router: Router<DefaultState, DefaultContext>
  ): this;

  registerTo(router: Router): this;

  get route(): Routes[];
}

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
