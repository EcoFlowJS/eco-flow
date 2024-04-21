import Router from "@koa/router";
import { DefaultContext, DefaultState } from "koa";

export type methods = (
  | "HEAD"
  | "OPTIONS"
  | "GET"
  | "PUT"
  | "PATCH"
  | "POST"
  | "DELETE"
)[];

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
