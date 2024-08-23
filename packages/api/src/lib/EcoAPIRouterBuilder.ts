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
    /**
     * Creates a unique list of RequestStack items by filtering out duplicate nodes.
     * @returns {RequestStack} A unique list of RequestStack items.
     */
    const requestStack: RequestStack = this._stack
      .map((node) => node[0])
      .filter((node, index, nodes) => nodes.indexOf(node) === index);

    /**
     * Creates a middleware stack based on the request stack by filtering and mapping the nodes.
     * @param {Array<any>} requestStack - The array of nodes in the request stack.
     * @returns {MiddlewareStack} A middleware stack generated from the request stack.
     */
    const middlewareStack: MiddlewareStack = requestStack.map((node) => [
      node,
      this._stack
        .filter((n) => n[0].id === node.id)
        .map((n) => n.filter((_n, index) => index > 0)),
    ]);

    /**
     * Returns an array containing two stacks: requestStack and middlewareStack.
     * @returns {Array} An array containing requestStack and middlewareStack.
     */
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

    /**
     * Returns a Promise that resolves to a NodeRequestController based on the provided controller input.
     * If the controller is a string, it fetches the controller from the ecoModule based on the string.
     * If the controller is not a string, it returns a default async function that resolves to the RouterRequestControllerBuilderOptions.
     * @param {string | (() => Promise<NodeRequestController>)} controller - The controller string or function.
     * @returns {Promise<NodeRequestController>} A Promise that resolves to a NodeRequestController.
     */
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

    /**
     * Asynchronously calls the nodeController with the given inputs and builds a router path based on the result.
     * @param {any} inputs - The inputs to be passed to the nodeController.
     * @returns {string} A router path based on the result of calling the nodeController.
     */
    return buildRouterPath(
      await new Promise((resolve, reject) =>
        Promise.resolve(nodeController.call(inputs)).then(resolve, reject)
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

    /**
     * Iterates over a stack of requests and processes each node to build a router request.
     * @param {Array} requestStack - The stack of requests to iterate over.
     * @returns None
     */
    for await (const node of requestStack) {
      const { ecoModule, _ } = ecoFlow;

      /**
       * Retrieves the type and controller from the nodes of a given module ID.
       * @param {string} node.data.moduleID._id - The ID of the module to retrieve nodes from.
       * @returns An object containing the type and controller of the nodes.
       */
      const { type, controller } = (await ecoModule.getNodes(
        node.data.moduleID._id
      ))!;

      /**
       * Find the configurations for a specific node ID in the list of configurations.
       * @param {string} nodeID - The ID of the node to find configurations for.
       * @returns The configurations for the specified node ID, if found; otherwise undefined.
       */
      const inputs = this._configurations.find(
        (configuration) => configuration.nodeID === node.id
      )?.configs;

      /**
       * Check if the type is not equal to "Request" and continue to the next iteration.
       * This statement is used to skip the current iteration and move to the next one in a loop.
       * @param {string} type - The type to check against the value "Request".
       * @returns None
       */
      if (type !== "Request") continue;

      /**
       * Builds a router request using the provided controller and inputs.
       * @param {string} controller - The controller to handle the request.
       * @param {object} inputs - The inputs for the request.
       * @returns An array containing the method and request path for the router request.
       */
      const [method, requestPath] = await this.buildRouterRequest(
        controller,
        inputs
      );

      /**
       * Checks if a route path is a duplicate and updates the internal state accordingly.
       * @param {string} method - The HTTP method of the route.
       * @param {string} requestPath - The path of the route.
       * @returns None
       */
      const checkPath = `${method} ${requestPath}`;
      if (this._isDuplicateRoutes[checkPath]) {
        this._isDuplicateRoutes[checkPath].push(node.id);
        continue;
      }

      /**
       * Sets the value of the _isDuplicateRoutes property with the given checkPath as key
       * and an array containing node.id as the value.
       * @param {string} checkPath - The path to check for duplicates.
       * @returns None
       */
      this._isDuplicateRoutes[checkPath] = [node.id];

      /**
       * Builds a Koa controller based on the middleware stack and configurations.
       * @param {Object} middlewareStack - The middleware stack to build the controller from.
       * @param {Object} configurations - The configurations to use in building the controller.
       * @returns {Promise} A promise that resolves to the Koa controller.
       */
      const koaController = await buildController(
        _.cloneDeep(
          middlewareStack.find((mStack) => mStack[0].id === node.id)?.[1]
        ),
        _.cloneDeep(this._configurations)
      );

      /**
       * Pushes a new array containing method, request path, and Koa controller to the result array.
       * @param {string} method - The HTTP method of the request.
       * @param {string} requestPath - The path of the request.
       * @param {string} koaController - The Koa controller handling the request.
       * @returns None
       */
      result.push([method, requestPath, koaController]);
    }

    /**
     * Removes duplicate routes from the _isDuplicateRoutes object where the length of the array is 1.
     * @returns None
     */
    Object.keys(this._isDuplicateRoutes).forEach((key) => {
      if (this._isDuplicateRoutes[key].length === 1)
        delete this._isDuplicateRoutes[key];
    });

    /**
     * Checks if there are any duplicate routes and throws an error if duplicates are found.
     * @returns None
     */
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

  /**
   * Builds an event listener based on the provided controller, inputs, and callback function.
   * @param {ModuleSpecs["controller"]} controller - The controller for the event listener.
   * @param {NodeConfiguration["configs"]} [inputs] - The input configurations for the event listener.
   * @param {(...args: any[]) => void} [callback] - The callback function to be executed.
   * @returns {Promise<any>} A promise that resolves when the event listener is built.
   */
  private async buildEventListener(
    controller: ModuleSpecs["controller"],
    inputs?: NodeConfiguration["configs"],
    callback?: (...args: any[]) => void
  ): Promise<any> {
    const { _, ecoModule } = ecoFlow;

    /**
     * Returns a Promise that resolves to a NodeEventListenerController based on the input parameters.
     * @param {Object} inputs - An object containing key-value pairs of input parameters.
     * @param {Function} callback - A function to be called after the controller is executed.
     * @returns {Promise<NodeEventListenerController>} A Promise that resolves to a NodeEventListenerController.
     */
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

    /**
     * Executes a function call using the nodeController with the provided inputs and callback.
     * @param {any} inputs - The inputs to be passed to the function call.
     * @param {Function} callback - The callback function to handle the result of the function call.
     * @returns {Promise} A promise that resolves with the result of the function call or rejects with an error.
     */
    return await new Promise((resolve, reject) =>
      Promise.resolve(nodeController.call(inputs, inputs, callback)).then(
        resolve,
        reject
      )
    );
  }

  /**
   * Initializes event configurations by iterating through the request stack and middleware stack.
   * Disconnects sockets, removes all listeners, and builds event listeners for each node in the request stack.
   * @param {RequestStack} requestStack - The stack of requests to process.
   * @param {MiddlewareStack} middlewareStack - The stack of middleware to apply.
   * @returns {Promise<void>} A promise that resolves once all event configurations are initialized.
   */
  private async initEventConfigs(
    requestStack: RequestStack,
    middlewareStack: MiddlewareStack
  ): Promise<void> {
    const { socket, ecoModule, _ } = ecoFlow;

    /**
     * Disconnects all sockets and removes all event listeners from the socket object.
     * @param {boolean} true - Whether to force disconnection of sockets.
     * @returns None
     */
    socket.disconnectSockets(true);
    socket.sockets.removeAllListeners();

    /**
     * Iterates over a stack of requests asynchronously and processes each node.
     * @param {AsyncIterable} requestStack - The stack of requests to iterate over.
     * @returns None
     */
    for await (const node of requestStack) {
      /**
       * Retrieves the type and controller from the nodes of a given module ID.
       * @param {string} node.data.moduleID._id - The ID of the module to retrieve nodes from.
       * @returns An object containing the type and controller of the nodes.
       */
      const { type, controller } = (await ecoModule.getNodes(
        node.data.moduleID._id
      ))!;

      /**
       * Find the configurations for a specific node ID in the list of configurations.
       * @param {string} nodeID - The ID of the node to find configurations for.
       * @returns The configurations for the specified node ID, if found; otherwise undefined.
       */
      const inputs = this._configurations.find(
        (configuration) => configuration.nodeID === node.id
      )?.configs;

      /**
       * Check if the type is not equal to "EventListener" and continue to the next iteration.
       * @param {string} type - The type to check against "EventListener".
       * @returns None
       */
      if (type !== "EventListener") continue;

      /**
       * Asynchronously builds an event controller using the provided middleware stack and configurations.
       * @param {Object} middlewareStack - The middleware stack containing event controller information.
       * @param {Object} configurations - The configurations for the event controller.
       * @param {string} type - The type of controller to build (e.g., "EVENT").
       * @returns {Promise<Object>} - A promise that resolves to the built event controller.
       */
      const eventController = await buildController(
        _.cloneDeep(
          middlewareStack.find((mStack) => mStack[0].id === node.id)?.[1]
        ),
        _.cloneDeep(this._configurations),
        "EVENT"
      );

      /**
       * Asynchronously builds an event listener using the provided controller, inputs, and event controller.
       * @param {Controller} controller - The controller object responsible for handling the event.
       * @param {Inputs} inputs - The inputs required for the event listener.
       * @param {EventController} eventController - The event controller object managing the event.
       * @returns None
       */
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

    /**
     * Initializes event configurations for the request stack and middleware stack.
     * @param {RequestStack} requestStack - The request stack to initialize event configurations for.
     * @param {MiddlewareStack} middlewareStack - The middleware stack to initialize event configurations for.
     * @returns Promise<void>
     */
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
