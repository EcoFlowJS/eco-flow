import {
  EcoAPIRouterBuilder as IEcoAPIRouterBuilder,
  Routes,
} from "@ecoflow/types";
import Router, { RouterOptions } from "@koa/router";

export class EcoAPIRouterBuilder
  extends Router
  implements IEcoAPIRouterBuilder
{
  constructor(opts?: RouterOptions) {
    super(opts);
  }

  upadteRoutes(path: string | RegExp, routes: Routes[]): void {
    routes.push({
      path: path,
      type: "Router",
      router: this,
    });
  }
}
