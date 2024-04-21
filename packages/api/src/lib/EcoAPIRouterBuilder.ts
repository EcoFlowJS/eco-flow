import {
  API_METHODS,
  EcoContext,
  EcoAPIRouterBuilder as IEcoAPIRouterBuilder,
  MiddlewareStack,
  ModuleSpecs,
  ModuleTypes,
  NodeConfiguration,
  NodeRequestController,
  Nodes,
  NodesStack,
  RequestStack,
  ResponseController,
  RouterRequestControllerBuilderOptions,
  Routes,
  UserControllers,
} from "@ecoflow/types";
import buildRoutePath from "../helpers/buildRoutePath";
import { Context } from "koa";

export class EcoAPIRouterBuilder implements IEcoAPIRouterBuilder {
  private _stack: NodesStack;
  private _configurations: NodeConfiguration[];
  private _routes: Routes[];

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

  private async buildRouterPath(
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

    try {
      return buildRoutePath(
        await new Promise((resolve, reject) => {
          const apiConfigs = nodeController.call(inputs);
          if (apiConfigs instanceof Promise) apiConfigs.then(resolve, reject);
          else resolve(apiConfigs);
        })
      );
    } catch (err) {
      throw err;
    }
  }

  private async buildUserControllers(
    middlewares: Nodes
  ): Promise<
    [
      string,
      ModuleTypes,
      NodeConfiguration["configs"] | undefined,
      () => Promise<UserControllers>
    ][]
  > {
    const { _, ecoModule } = ecoFlow;
    const result: [
      string,
      ModuleTypes,
      NodeConfiguration["configs"] | undefined,
      () => Promise<UserControllers>
    ][] = [];
    for await (const middleware of middlewares) {
      const { type, controller } = await ecoModule.getNodes(
        middleware.data.moduleID._id
      )!;
      if (type === "Request") continue;

      const inputs = this._configurations.find(
        (configuration) => configuration.nodeID === middleware.id
      )?.configs;

      const nodeController: () => Promise<void> = _.isString(controller)
        ? await ecoModule
            .getModuleSchema(controller.split(".")[0])
            .getController(controller.split(".")[1])
        : controller ||
          function (this: EcoContext) {
            this.next();
          };
      const modduleType: ModuleTypes =
        middleware.type === "Request"
          ? "Request"
          : middleware.type === "Middleware"
          ? "Middleware"
          : middleware.type === "Debug"
          ? "Debug"
          : middleware.type === "Response"
          ? "Response"
          : "Request";

      result.push([middleware.id, modduleType, inputs, nodeController]);
    }

    return result;
  }

  private async buildRouterMiddleware(middlewares: NodesStack = []) {
    return async (ctx: Context) => {
      const { _ } = ecoFlow;
      const controllerResponse = Object.create({});
      const middlewareResponse = Object.create({});

      for await (const middleware of middlewares) {
        const controllers = await this.buildUserControllers(middleware);
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

          if (type === "Middleware") {
            await new Promise((resolve, reject) => {
              const userController = userControllers.call(ecoContext);
              if (userController instanceof Promise)
                userController.then(resolve, reject);
              resolve(userController);
            });

            controllerResponse[id] = ecoContext.payload || {};
          }

          if (type === "Response") {
            const [id, response]: ResponseController = await new Promise(
              (resolve, reject) => {
                const userController = userControllers.call(
                  ecoContext
                ) as Promise<ResponseController>;
                if (userController instanceof Promise)
                  userController.then(resolve, reject);
                resolve(userController);
              }
            );

            middlewareResponse[id] = response;
            const updatedContext: Context = { ...ecoContext };
            delete updatedContext.payload;
            delete updatedContext.inputs;
            delete updatedContext.next;
            Object.keys(updatedContext)
              .filter((key) => key !== "body")
              .map((key) => {
                ctx[key] = updatedContext[key];
              });
          }

          if (type === "Debug") {
            //Todo: this should be implemented
            console.log(
              "Debug",
              lastControllerID
                ? controllerResponse[lastControllerID]
                : ecoContext.payload
            );
          }

          lastControllerID = id;
        }
      }

      if (!_.isEmpty(middlewareResponse)) ctx.body = middlewareResponse;
    };
  }

  private async buildRouterStack(
    requestStack: RequestStack,
    middlewareStack: MiddlewareStack
  ): Promise<[API_METHODS, string, (ctx: Context) => void][]> {
    let result: [API_METHODS, string, (ctx: Context) => void][] = [];
    for await (const node of requestStack) {
      const { ecoModule } = ecoFlow;
      const { type, controller } = ecoModule.getNodes(node.data.moduleID._id)!;
      const inputs = this._configurations.find(
        (configuration) => configuration.nodeID === node.id
      )?.configs;

      if (type !== "Request") continue;
      const [methods, requestPath] = await this.buildRouterPath(
        controller,
        inputs
      );

      const middleware = await this.buildRouterMiddleware(
        middlewareStack.find((mStack) => mStack[0].id === node.id)?.[1]
      );
      result.push([methods, requestPath, middleware]);
    }

    return result;
  }

  async initializeBuilder(): Promise<IEcoAPIRouterBuilder> {
    const [requestStack, middlewareStack] = this.routerBuilderStacks;
    this._routes = (
      await this.buildRouterStack(requestStack, middlewareStack)
    ).map((stack) => {
      const [method, path, controller] = stack;
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
}
