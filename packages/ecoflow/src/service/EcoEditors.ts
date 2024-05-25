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
import editorsApiRoutes from "../api/editorsApiRoutes.routes";
import { RouterOptions } from "@koa/router";

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
   * Initializes the editors router.
   * If systemRouterOptions is empty, it sets a default prefix of "/systemApi".
   * Finally, it creates and sets up the router for the system and adds it to the server middleware.
   * @returns Promise<void>
   */
  private async initializeEditorsRouter(): Promise<void> {
    const systemRouterOptions: RouterOptions = {
      prefix: "/systemApi", //Prefix for all routes
      methods: ["GET", "PUT", "POST", "DELETE", "PATCH"], //Methods which should be supported by the router.
      strict: true, // Whether or not routes should matched strictly. [If strict matching is enabled, the trailing slash is taken into account when matching routes.]
    };

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
      ? true
      : false;

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
