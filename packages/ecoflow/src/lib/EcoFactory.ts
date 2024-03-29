import { EcoFactory as IEcoFactory } from "@ecoflow/types";
import Router from "@koa/router";
export class EcoFactory implements IEcoFactory {
  constructor() {}

  createEcoController() {}
  createEcoService() {}
  createCoreRouter() {
    return new Router();
  }
}
