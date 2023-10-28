import { Routes } from "./EcoSystemAPIBuilder";

export interface EcoAPIRouterBuilder {
  upadteRoutes(path: string | RegExp, routes: Routes[]): void;
}
