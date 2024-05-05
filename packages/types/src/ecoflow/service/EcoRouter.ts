import KoaRouter from "@koa/router";
import { DefaultContext, DefaultState } from "koa";

export interface EcoRouter {
  /**
   * A variable that may hold a KoaRouter instance with DefaultState and DefaultContext types.
   * It can be undefined if not initialized.
   */
  systemRouter: KoaRouter<DefaultState, DefaultContext> | undefined;
  /**
   * Represents a KoaRouter instance with DefaultState and DefaultContext types.
   * @type {KoaRouter<DefaultState, DefaultContext>}
   */
  apiRouter: KoaRouter<DefaultState, DefaultContext>;
}
