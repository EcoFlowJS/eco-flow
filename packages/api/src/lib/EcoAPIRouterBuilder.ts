import {
  API_METHODS,
  EcoAPIRouterBuilder as IEcoAPIRouterBuilder,
  MiddlewareStack,
  ModuleSpecs,
  NodeConfiguration,
  NodeEventListenerController,
  NodeRequestController,
  NodesStack,
  RequestStack,
  RouterRequestControllerBuilderOptions,
  Routes,
} from "@ecoflow/types";
import buildRouterPath from "../helpers/buildRouterPath";
import { Context } from "koa";
import EcoModule from "@ecoflow/module";
import buildController from "../helpers/buildController";

/**
 * A class that builds an Eco API router based on the provided node stack and configurations.
 */
export class EcoAPIRouterBuilder implements IEcoAPIRouterBuilder {
  private _stack: NodesStack;
  private _configurations: NodeConfiguration[];
  private _routes: Routes[];
  private _isDuplicateRoutes: { [key: string]: string[] } = {};

  /**
   * Constructs a new instance of a class with the given node stack and configurations.
   * @param {NodesStack} nodeStack - The stack of nodes to be used.
   * @param {NodeConfiguration[]} configurations - The configurations for the nodes.
   * @returns None
   */
  constructor(nodeStack: NodesStack, configurations: NodeConfiguration[]) {
    this._stack = nodeStack;
    this._configurations = configurations;
    this._routes = [];
  }

  /**
   * Returns a tuple containing the request stack and middleware stack based on the current stack.
   * The request stack contains unique nodes from the current stack.
   * The middleware stack contains nodes grouped by request node with associated middleware nodes.
   * @returns A tuple containing the request stack and middleware stack.
   */
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

  /**
   * Builds a router request based on the provided controller and inputs.
   * @param {ModuleSpecs["controller"]} controller - The controller for the router request.
   * @param {NodeConfiguration["configs"]} [inputs] - The configurations for the node.
   * @returns {Promise<[API_METHODS, string]>} A promise that resolves to an array containing the API method and the router path.
   */
  private async buildRouterRequest(
    controller: ModuleSpecs["controller"],
    inputs?: NodeConfiguration["configs"]
  ): Promise<[API_METHODS, string]> {
    const { _, ecoModule } = ecoFlow;
    const nodeController: () => Promise<NodeRequestController> = _.isString(
      controller
    )
      ? ecoModule
          .getModuleSchema(new EcoModule.IDBuilders(controller.split(".")[0]))
          .getController(controller.split(".")[1])
      : controller ||
        async function (this: RouterRequestControllerBuilderOptions) {
          return this;
        };

    return buildRouterPath(
      await new Promise((resolve, reject) =>
        nodeController.call(inputs).then(resolve, reject)
      )
    );
  }

  /**
   * Asynchronously generates route configurations based on the provided request stack and middleware stack.
   * @param {RequestStack} requestStack - The stack of requests to generate routes for.
   * @param {MiddlewareStack} middlewareStack - The stack of middleware to apply to the routes.
   * @returns A promise that resolves to an array of tuples containing API method, request path, and Koa controller function.
   */
  private async generateRoutesConfigs(
    requestStack: RequestStack,
    middlewareStack: MiddlewareStack
  ): Promise<[API_METHODS, string, (ctx: Context) => void][]> {
    let result: [API_METHODS, string, (ctx: Context) => void][] = [];
    this._isDuplicateRoutes = {};

    for await (const node of requestStack) {
      const { ecoModule, _ } = ecoFlow;
      const { type, controller } = (await ecoModule.getNodes(
        node.data.moduleID._id
      ))!;
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

      const koaController = await buildController(
        _.cloneDeep(
          middlewareStack.find((mStack) => mStack[0].id === node.id)?.[1]
        ),
        _.cloneDeep(this._configurations)
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

  private async buildEventListener(
    controller: ModuleSpecs["controller"],
    inputs?: NodeConfiguration["configs"],
    callback?: (...args: any[]) => void
  ): Promise<any> {
    const { _, ecoModule } = ecoFlow;

    const nodeController: (
      inputs?: {
        [key: string]: any;
      },
      callback?: (...args: any[]) => void
    ) => Promise<NodeEventListenerController> = _.isString(controller)
      ? ecoModule
          .getModuleSchema(new EcoModule.IDBuilders(controller.split(".")[0]))
          .getController(controller.split(".")[1])
      : controller || async function () {};

    return await new Promise((resolve, reject) =>
      nodeController.call(inputs, inputs, callback).then(resolve, reject)
    );
  }

  private async initEventConfigs(
    requestStack: RequestStack,
    middlewareStack: MiddlewareStack
  ): Promise<void> {
    const { socket } = ecoFlow;
    socket.disconnectSockets(true);
    socket.sockets.removeAllListeners();

    for await (const node of requestStack) {
      const { ecoModule, _ } = ecoFlow;

      const { type, controller } = (await ecoModule.getNodes(
        node.data.moduleID._id
      ))!;

      const inputs = this._configurations.find(
        (configuration) => configuration.nodeID === node.id
      )?.configs;

      if (type !== "EventListener") continue;

      const eventController = await buildController(
        _.cloneDeep(
          middlewareStack.find((mStack) => mStack[0].id === node.id)?.[1]
        ),
        _.cloneDeep(this._configurations),
        "EVENT"
      );
      await this.buildEventListener(controller, inputs, eventController);
    }
  }

  /**
   * Asynchronously initializes the Eco API Router Builder by generating route configurations
   * based on the request and middleware stacks. It then maps the generated route configurations
   * to create route objects with path, method type, method, and controller properties.
   * @returns {Promise<IEcoAPIRouterBuilder>} A promise that resolves to the initialized Eco API Router Builder.
   */
  async initializeBuilder(): Promise<IEcoAPIRouterBuilder> {
    const [requestStack, middlewareStack] = this.routerBuilderStacks;

    const routesSchema = await this.generateRoutesConfigs(
      requestStack,
      middlewareStack
    );

    await this.initEventConfigs(requestStack, middlewareStack);

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

  /**
   * Getter method to retrieve the routes array.
   * @returns {Routes[]} - An array of Routes objects.
   */
  get routes(): Routes[] {
    return this._routes;
  }

  /**
   * Getter method to retrieve the NodesStack object stored in the nodeStack property.
   * @returns {NodesStack} The NodesStack object stored in the nodeStack property.
   */
  get nodeStack(): NodesStack {
    return this._stack;
  }

  /**
   * Getter method to retrieve the configurations of the node.
   * @returns {NodeConfiguration[]} - An array of NodeConfiguration objects.
   */
  get configurations(): NodeConfiguration[] {
    return this._configurations;
  }
}
