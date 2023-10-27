import Router from "@koa/router";
import { DefaultState, DefaultContext } from "koa";

export interface EcoAPIController {
  API: API;
  registerAPI(router: Router): void;
}

export interface API {
  path: string | RegExp;
  methods: "Router" | methods;
  middleware?:
    | Router.Middleware<DefaultState, DefaultContext>
    | Array<Router.Middleware<DefaultState, DefaultContext>>;
  router?: Router<DefaultState, DefaultContext>;
  opts?: Router.LayerOptions;
}
type methods = (
  | "HEAD"
  | "OPTIONS"
  | "GET"
  | "PUT"
  | "PATCH"
  | "POST"
  | "DELETE"
)[];
