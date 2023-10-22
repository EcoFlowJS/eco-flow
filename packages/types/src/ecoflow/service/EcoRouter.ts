import KoaRouter, { RouterOptions } from "@koa/router";
import { DefaultContext, DefaultState } from "koa";

export interface EcoRouter {
  systemRouter: KoaRouter<DefaultState, DefaultContext>;
  apiRouter: KoaRouter<DefaultState, DefaultContext>;
  createRouter(opt: RouterOptions): KoaRouter;
  loadAdminEditor(): void;
  loadFlowEditor(): void;
  loadSchemaEditor(): void;
  loadAllEditors(): void;
}
