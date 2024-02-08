import KoaRouter from "@koa/router";
import { DefaultContext, DefaultState } from "koa";

export interface EcoRouter {
  systemRouter: KoaRouter<DefaultState, DefaultContext> | undefined;
  apiRouter: KoaRouter<DefaultState, DefaultContext>;
}
