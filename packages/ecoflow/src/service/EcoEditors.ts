import loadAdmin from "@eco-flow/admin-panel";
import loadFlow from "@eco-flow/flow-editor";
import loadSchema from "@eco-flow/schema-editor";
import loadEditorsApiRoutes from "../api";
import {
  EcoFlow,
  EcoRouter as IEcoRouter,
  EcoServer as IEcoServer,
  EcoEditors as IEcoEditors,
} from "@eco-flow/types";
import _ from "lodash";
import proxy from "koa-proxies";
import { EcoRouter } from "./EcoRouter";

export class EcoEditors implements IEcoEditors {
  private server: IEcoServer;
  private router: IEcoRouter;
  private isAuth: boolean;
  constructor({ server, router, isAuth }: EcoFlow) {
    this.server = server;
    this.router = router;
    this.isAuth = isAuth;
  }

  private initializeEditorsRouter(): void {
    let { systemRouterOptions } = ecoFlow.config._config;
    if (_.isEmpty(systemRouterOptions)) {
      systemRouterOptions = {};
      systemRouterOptions.prefix = "/systemApi";
    }

    if (!ecoFlow._.has(systemRouterOptions, "prefix"))
      systemRouterOptions.prefix = "/systemApi";

    const router = EcoRouter.createRouter(systemRouterOptions);
    this.router.systemRouter = router;
    this.server.use(router.routes()).use(router.allowedMethods());
  }

  loadEditors(): void {
    if (this.server.env === "developmen") {
      this.server.use(
        proxy("/admin", {
          target: "http://localhost:3000",
          changeOrigin: true,
        })
      );
      this.server.use(
        proxy("/editor/flow", {
          target: "http://localhost:3000",
          changeOrigin: true,
        })
      );
      this.server.use(
        proxy("/editor/schema", {
          target: "http://localhost:3000",
          changeOrigin: true,
        })
      );
      return;
    }

    let { editor } = ecoFlow.config._config;

    if (ecoFlow._.isEmpty(editor)) editor = { enabled: true };

    editor.admin = ecoFlow._.isUndefined(editor.admin)
      ? true
      : this.isAuth
      ? true
      : editor.admin
      ? false
      : editor.admin;

    editor.flow = ecoFlow._.isUndefined(editor.flow) ? true : editor.flow;
    editor.schema = ecoFlow._.isUndefined(editor.schema) ? true : editor.schema;

    if (!editor.admin && !editor.flow && !editor.schema)
      editor = { enabled: false };

    if (!editor.enabled) return;

    this.initializeEditorsRouter();

    if (editor.admin) loadAdmin(this.server);
    if (editor.flow) loadFlow(this.server);
    if (editor.schema) loadSchema(this.server);
  }

  static loadEditorsRoutes(): void {
    loadEditorsApiRoutes();
  }
}
