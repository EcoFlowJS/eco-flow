import loadAdmin from "@ecoflow/admin-panel";
import loadFlow from "@ecoflow/flow-editor";
import loadSchema from "@ecoflow/schema-editor";
import loadLanding from "@ecoflow/base-panel";
import {
  EcoFlow,
  EcoRouter as IEcoRouter,
  EcoServer as IEcoServer,
  EcoEditors as IEcoEditors,
} from "@ecoflow/types";
import _ from "lodash";
import proxy from "koa-proxies";
import { EcoRouter } from "./EcoRouter";
import { Builder } from "@ecoflow/utils";
import loadEnvironments from "../helper/env.helper";
import editorsApiRoutes from "../api/editorsApiRoutes.routes";

/**
 * Class representing EcoEditors that implements EcoEditors interface.
 */
export class EcoEditors implements IEcoEditors {
  private server: IEcoServer;
  private router: IEcoRouter;
  private isAuth: boolean;

  /**
   * Constructs an EcoFlow object with the provided server, router, and isAuth properties.
   * @param {EcoFlow} server - The server object.
   * @param {EcoFlow} router - The router object.
   * @param {EcoFlow} isAuth - The authentication status.
   * @returns None
   */
  constructor({ server, router, isAuth }: EcoFlow) {
    this.server = server;
    this.router = router;
    this.isAuth = isAuth;
  }

  /**
   * Initializes the editors router with the specified systemRouterOptions and envDir.
   * If systemRouterOptions is empty, it sets a default prefix of "/systemApi".
   * It then sets the CLIENT_API_ENDPOINT environment variable and configures the Client API endpoint.
   * Finally, it creates and sets up the router for the system and adds it to the server middleware.
   * @returns Promise<void>
   */
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

  /**
   * Sets up a default redirect route to "/auth" using EcoRouter.
   * @returns None
   */
  private defaultRedirect() {
    const baseRouter = EcoRouter.createRouter();
    baseRouter.get("/", (ctx) => ctx.redirect("/auth"));
    this.server.use(baseRouter.routes()).use(baseRouter.allowedMethods());
  }

  /**
   * Asynchronously loads the editors based on the environment and configuration settings.
   * If the environment is in development, it sets up proxy routes and initializes the editors router.
   * If the environment is not in development, it configures the editor settings based on the configuration.
   * @returns Promise<void>
   */
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

  /**
   * Loads the routes for the editors API.
   * @returns None
   */
  static loadEditorsRoutes(): void {
    editorsApiRoutes();
  }
}
