import Router from "@koa/router";

export interface EcoFactory {
  createEcoController(): void;
  createEcoService(): void;
  createCoreRouter(): Router;
}
