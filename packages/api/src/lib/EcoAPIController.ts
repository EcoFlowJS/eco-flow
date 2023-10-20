import { EcoAPIController as IEcoAPIController, API } from "@eco-flow/types";
import Router from "@koa/router";

export class EcoAPIController implements IEcoAPIController {
  API: API;
  constructor(api?: API) {
    this.API = api!;
  }

  registerAPI(router: Router) {
    router.register(
      this.API.path,
      this.API.methods,
      this.API.middleware,
      this.API.opts
    );
  }
}
