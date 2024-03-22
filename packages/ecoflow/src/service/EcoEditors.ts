import loadAdmin from "@eco-flow/admin-panel";
import loadFlow from "@eco-flow/flow-editor";
import loadSchema from "@eco-flow/schema-editor";
import loadLanding from "@eco-flow/base-panel";
import {
  EcoFlow,
  EcoRouter as IEcoRouter,
  EcoServer as IEcoServer,
  EcoEditors as IEcoEditors,
} from "@eco-flow/types";
import _ from "lodash";
import proxy from "koa-proxies";
import { EcoRouter } from "./EcoRouter";
import { Builder } from "@eco-flow/utils";
import loadEnvironments from "../helper/env.helper";
import editorsApiRoutes from "../api/editorsApiRoutes.routes";

export class EcoEditors implements IEcoEditors {
  private server: IEcoServer;
  private router: IEcoRouter;
  private isAuth: boolean;
  constructor({ server, router, isAuth }: EcoFlow) {
    this.server = server;
    this.router = router;
    this.isAuth = isAuth;
  }

  private async initializeEditorsRouter(): Promise<void> {
    let { systemRouterOptions, envDir } = ecoFlow.config._config;
    if (_.isEmpty(systemRouterOptions)) {
      systemRouterOptions = {};
      systemRouterOptions.prefix = "/systemApi";
    }

    if (!ecoFlow._.has(systemRouterOptions, "prefix")) {
      systemRouterOptions.prefix = "/systemApi";
    }

    const setEnv = async () => {
      Builder.ENV.setSystemEnv(envDir!, [
        {
          name: "CLIENT_API_ENDPOINT",
          value: this.server.baseUrl + systemRouterOptions!.prefix,
        },
      ]);
      ecoFlow.log.info("Client API endpoint Configured...");
      loadEnvironments();
    };

    if (_.isUndefined(process.env.ECOFLOW_SYS_CLIENT_API_ENDPOINT))
      await setEnv();
    else if (
      process.env.ECOFLOW_SYS_CLIENT_API_ENDPOINT !==
      this.server.baseUrl + systemRouterOptions!.prefix
    )
      await setEnv();
    const router = EcoRouter.createRouter(systemRouterOptions);
    this.router.systemRouter = router;
    this.server.use(router.routes()).use(router.allowedMethods());
  }

  private defaultRedirect() {
    const baseRouter = EcoRouter.createRouter();
    baseRouter.get("/", (ctx) => ctx.redirect("/auth"));
    this.server.use(baseRouter.routes()).use(baseRouter.allowedMethods());
  }

  async loadEditors(): Promise<void> {
    if (this.server.env === "development") {
      this.defaultRedirect();
      await this.initializeEditorsRouter();
      this.server.use(
        proxy("/auth", {
          target: "http://localhost:3000",
          changeOrigin: true,
        })
      );
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

    await this.initializeEditorsRouter();
    this.defaultRedirect();
    loadLanding(this.server);
    if (editor.admin) loadAdmin(this.server);
    if (editor.flow) loadFlow(this.server);
    if (editor.schema) loadSchema(this.server);
  }

  static loadEditorsRoutes(): void {
    editorsApiRoutes();
  }
}
