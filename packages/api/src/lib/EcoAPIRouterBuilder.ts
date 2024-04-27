import {
  API_METHODS,
  EcoContext,
  EcoAPIRouterBuilder as IEcoAPIRouterBuilder,
  MiddlewareStack,
  ModuleSpecs,
  NodeConfiguration,
  NodeRequestController,
  NodesStack,
  RequestStack,
  RouterRequestControllerBuilderOptions,
  Routes,
} from "@ecoflow/types";
import buildRouterPath from "../helpers/buildRouterPath";
import { Context } from "koa";
import TPromise from "thread-promises";
import responseController from "../helpers/responseController";
import middlewareController from "../helpers/middlewareController";
import buildUserControllers from "../helpers/buildUserControllers";
import debugController from "../helpers/debugController";

export class EcoAPIRouterBuilder implements IEcoAPIRouterBuilder {
  private _stack: NodesStack;
  private _configurations: NodeConfiguration[];
  private _routes: Routes[];
  private _isDuplicateRoutes: { [key: string]: string[] } = {};

  constructor(nodeStack: NodesStack, configurations: NodeConfiguration[]) {
    this._stack = nodeStack;
    this._configurations = configurations;
    this._routes = [];
  }

  private get routerBuilderStacks(): [RequestStack, MiddlewareStack] {
    const requestStack: RequestStack = this._stack
      .map((node) => node[0])
      .filter((node, index, nodes) => nodes.indexOf(node) === index);

    const middlewareStack: MiddlewareStack = requestStack.map((node) => [
      node,
      this._stack
        .filter((n) => n[0].id === node.id)
        .map((n) => n.filter((_n, index) => index > 0)),
    ]);

    return [requestStack, middlewareStack];
  }

  private async buildRouterRequest(
    controller: ModuleSpecs["controller"],
    inputs?: NodeConfiguration["configs"]
  ): Promise<[API_METHODS, string]> {
    const { _, ecoModule } = ecoFlow;
    const nodeController: () => Promise<NodeRequestController> = _.isString(
      controller
    )
      ? ecoModule
          .getModuleSchema(controller.split(".")[0])
          .getController(controller.split(".")[1])
      : controller ||
        function (this: RouterRequestControllerBuilderOptions) {
          return this;
        };

    return buildRouterPath(
      await new Promise((resolve, reject) => {
        const apiConfigs = nodeController.call(inputs);
        if (apiConfigs instanceof Promise) apiConfigs.then(resolve, reject);
        else resolve(apiConfigs);
      })
    );
  }

  private async buildKoaController(middlewares: NodesStack = []) {
    return async (ctx: Context) => {
      const { _ } = ecoFlow;
      const controllerResponse = Object.create({});
      const middlewareResponse = Object.create({});
      const concurrentMiddlewares: TPromise<Array<void>, void, void>[] =
        middlewares.map(
          (middleware) =>
            new TPromise<Array<void>, void, void>(async (resolve) => {
              const controllers = await buildUserControllers(
                middleware,
                this._configurations
              );
              let isNext = true;
              let lastControllerID: string | null = null;

              const ecoContext: EcoContext = {
                ...ctx,
                payload: { msg: (<any>ctx.request).body || {} },
                next() {
                  isNext = true;
                },
              };

              for await (const controller of controllers) {
                const [id, type, inputs, userControllers] = controller;
                if (_.has(controllerResponse, id)) continue;

                if (!isNext && type === "Middleware") {
                  controllerResponse[id] = lastControllerID
                    ? controllerResponse[lastControllerID]
                    : ecoContext.payload;
                  lastControllerID = id;
                  continue;
                }
                isNext = false;
                ecoContext.inputs = inputs;

                if (type === "Middleware")
                  await middlewareController(
                    id,
                    ecoContext,
                    userControllers,
                    controllerResponse
                  );

                if (type === "Response")
                  await responseController(
                    ecoContext,
                    ctx,
                    userControllers,
                    middlewareResponse
                  );

                if (type === "Debug")
                  await debugController(
                    ecoContext,
                    lastControllerID
                      ? controllerResponse[lastControllerID]
                      : {},
                    userControllers
                  );

                lastControllerID = id;
              }
              resolve();
            })
        );

      await Promise.all(concurrentMiddlewares);
      if (!_.isEmpty(middlewareResponse)) ctx.body = middlewareResponse;
    };
  }

  private async generateRoutesConfigs(
    requestStack: RequestStack,
    middlewareStack: MiddlewareStack
  ): Promise<[API_METHODS, string, (ctx: Context) => void][]> {
    let result: [API_METHODS, string, (ctx: Context) => void][] = [];
    this._isDuplicateRoutes = {};
    for await (const node of requestStack) {
      const { ecoModule } = ecoFlow;
      const { type, controller } = ecoModule.getNodes(node.data.moduleID._id)!;
      const inputs = this._configurations.find(
        (configuration) => configuration.nodeID === node.id
      )?.configs;

      if (type !== "Request") continue;
      const [method, requestPath] = await this.buildRouterRequest(
        controller,
        inputs
      );

      const checkPath = `${method} ${requestPath}`;
      if (this._isDuplicateRoutes[checkPath]) {
        this._isDuplicateRoutes[checkPath].push(node.id);
        continue;
      }
      this._isDuplicateRoutes[checkPath] = [node.id];

      const koaController = await this.buildKoaController(
        middlewareStack.find((mStack) => mStack[0].id === node.id)?.[1]
      );
      result.push([method, requestPath, koaController]);
    }

    Object.keys(this._isDuplicateRoutes).forEach((key) => {
      if (this._isDuplicateRoutes[key].length === 1)
        delete this._isDuplicateRoutes[key];
    });

    if (Object.keys(this._isDuplicateRoutes).length > 0) {
      const routes = Object.keys(this._isDuplicateRoutes);
      const nodesID: string[] = [];
      routes.forEach((route) =>
        this._isDuplicateRoutes[route].forEach((nodeID) => nodesID.push(nodeID))
      );

      throw {
        msg: "Duplicate routes",
        routes,
        nodesID,
      };
    }

    return result;
  }

  async initializeBuilder(): Promise<IEcoAPIRouterBuilder> {
    const [requestStack, middlewareStack] = this.routerBuilderStacks;

    const routesSchema = await this.generateRoutesConfigs(
      requestStack,
      middlewareStack
    );

    this._routes = routesSchema.map((configs) => {
      const [method, path, controller] = configs;
      return {
        path,
        type: "method",
        method: [method],
        controller,
      };
    });
    return this;
  }

  get routes(): Routes[] {
    return this._routes;
  }

  get nodeStack(): NodesStack {
    return this._stack;
  }

  get configurations(): NodeConfiguration[] {
    return this._configurations;
  }
}
