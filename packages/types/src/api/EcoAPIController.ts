import Router from "@koa/router";
import { DefaultState, DefaultContext } from "koa";

export interface EcoAPIController {
  API: API;
  registerAPI(router: Router): void;
}

export interface API {
  path: string | RegExp;
  methods: string[];
  middleware:
    | Router.Middleware<DefaultState, DefaultContext>
    | Array<Router.Middleware<DefaultState, DefaultContext>>;
  opts?: Router.LayerOptions;
}
