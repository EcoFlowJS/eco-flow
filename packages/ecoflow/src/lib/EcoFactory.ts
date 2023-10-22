import { EcoFactory as IEcoFactory } from "@eco-flow/types";
import Router from "@koa/router";
export class EcoFactory implements IEcoFactory {
  constructor() {}

  createEcoController() {}
  createEcoService() {}
  createCoreRouter() {
    return new Router();
  }
}
