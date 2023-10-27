import { EcoAPIController as IEcoAPIController, API } from "@eco-flow/types";
import Router from "@koa/router";

export class EcoAPIController implements IEcoAPIController {
  API: API;
  constructor(api?: API) {
    this.API = api!;
  }

  registerAPI(router: Router) {
    if (Array.isArray(this.API.methods))
      router.register(
        this.API.path,
        this.API.methods,
        this.API.middleware!,
        this.API.opts
      );

    if (typeof this.API.methods === "string" && this.API.methods == "Router")
      router.use(
        this.API.path,
        this.API.router!.routes(),
        this.API.router!.allowedMethods()
      );
  }
}
