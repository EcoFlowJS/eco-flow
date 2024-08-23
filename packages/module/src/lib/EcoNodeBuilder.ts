import {
  ExtractedRawNodes,
  EcoNodeBuilder as IEcoNodeBuilder,
  ModuleNodes,
  ModuleSchema,
  ModuleSpecsInputs,
} from "@ecoflow/types";

/**
 * Class for building Eco nodes based on the provided module schema.
 */
export class EcoNodeBuilder implements IEcoNodeBuilder {
  private _moduleSchema: ModuleSchema[];

  /**
   * Constructor for creating an instance of a class with the given module schema.
   * @param {ModuleSchema[]} moduleSchema - An array of module schemas.
   * @returns None
   */
  constructor(moduleSchema: ModuleSchema[]) {
    this._moduleSchema = moduleSchema;
  }

  /**
   * Retrieves an array of schema nodes from the module schema.
   * @returns {ModuleNodes[]} An array of schema nodes.
   */
  private get getSchemaNodes(): ModuleNodes[] {
    const nodes: ModuleNodes[] = [];
    this._moduleSchema.map((m) => {
      if (m.module && m.module.nodes) nodes.push(...m.module.nodes);
    });
    return nodes;
  }

  /**
   * Extracts and categorizes different types of nodes from the schema nodes.
   * @returns An object containing arrays of nodes categorized by type: requestNodes, middlewareNodes, responseNodes, consoleNodes.
   */
  private get extractNodes(): ExtractedRawNodes {
    const nodes: ModuleNodes[] = this.getSchemaNodes;

    /**
     * Filters an array of nodes to only include nodes of type "Request".
     * @param {ModuleNodes[]} nodes - The array of nodes to filter.
     * @returns {ModuleNodes[]} An array of nodes that are of type "Request".
     */
    const requestNodes: ModuleNodes[] = nodes.filter(
      (n) => n.type === "Request"
    );

    /**
     * Filters an array of nodes to only include those of type "Middleware".
     * @param {ModuleNodes[]} nodes - The array of nodes to filter.
     * @returns {ModuleNodes[]} An array of nodes that are of type "Middleware".
     */
    const middlewareNodes: ModuleNodes[] = nodes.filter(
      (n) => n.type === "Middleware"
    );

    /**
     * Filters an array of nodes to only include those of type "Response".
     * @param {ModuleNodes[]} nodes - The array of nodes to filter.
     * @returns {ModuleNodes[]} An array of nodes that are of type "Response".
     */
    const responseNodes: ModuleNodes[] = nodes.filter(
      (n) => n.type === "Response"
    );

    /**
     * Filters an array of nodes to only include nodes of type "Debug".
     * @param {ModuleNodes[]} nodes - An array of ModuleNodes to filter.
     * @returns {ModuleNodes[]} An array of ModuleNodes of type "Debug".
     */
    const consoleNodes: ModuleNodes[] = nodes.filter((n) => n.type === "Debug");

    /**
     * Filters an array of nodes to only include those of type "EventListener".
     * @param {ModuleNodes[]} nodes - The array of nodes to filter.
     * @returns {ModuleNodes[]} An array of nodes that are of type "EventListener".
     */
    const eventListenerNodes: ModuleNodes[] = nodes.filter(
      (n) => n.type === "EventListener"
    );

    /**
     * Filters an array of nodes to only include those of type "EventEmitter".
     * @param {ModuleNodes[]} nodes - The array of nodes to filter.
     * @returns {ModuleNodes[]} An array of nodes that are of type "EventEmitter".
     */
    const eventEmitterNodes: ModuleNodes[] = nodes.filter(
      (n) => n.type === "EventEmitter"
    );

    return {
      requestNodes,
      middlewareNodes,
      responseNodes,
      consoleNodes,
      eventListenerNodes,
      eventEmitterNodes,
    };
  }

  /**
   * Builds an array of ModuleNodes based on the module configurations in ecoFlow.
   * @returns {ModuleNodes[]} An array of ModuleNodes containing the module name and nodes.
   */
  private buildConfigurationsNodes(): ModuleNodes[] {
    /**
     * Destructures the _ and moduleConfigurations properties from the ecoFlow object.
     * @param {Object} ecoFlow - The ecoFlow object containing _ and moduleConfigurations properties.
     * @returns None
     */
    const { _, moduleConfigurations } = ecoFlow;

    /**
     * An array of ModuleNodes, representing nodes in a module.
     * @type {ModuleNodes[]}
     */
    const moduleNodes: ModuleNodes[] = [];

    this._moduleSchema
      .map((m) => ({
        moduleName: m.module?.name || m.name,
        nodes: m.module?.nodes || [],
      }))
      .forEach(({ moduleName, nodes }) => {
        if (nodes.filter((n) => n.type === "Configuration").length === 0)
          return null;

        moduleConfigurations[moduleName] = [];

        nodes
          .filter((n) => n.type === "Configuration")
          .forEach((node) => moduleNodes.push(node));
      });

    return moduleNodes;
  }

  /**
   * Builds request nodes by adding default inputs if they are missing in the module nodes.
   * @param {ModuleNodes[]} requestNodes - An array of module nodes representing the request nodes.
   * @returns {ModuleNodes[]} - An array of module nodes with default inputs added if missing.
   */
  private buildRequestNodes(requestNodes: ModuleNodes[]): ModuleNodes[] {
    if (requestNodes.length === 0) return [];
    const { _ } = ecoFlow;

    /**
     * Checks if there is at least one input of type "Route" in the given array of ModuleSpecsInputs.
     * @param {ModuleSpecsInputs[]} inputs - An array of ModuleSpecsInputs to check.
     * @returns {boolean} True if there is at least one input of type "Route", false otherwise.
     */
    const isInputRoute = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.type === "Route").length > 0;

    /**
     * Checks if there is at least one method route in the given array of ModuleSpecsInputs.
     * @param {ModuleSpecsInputs[]} inputs - An array of ModuleSpecsInputs objects.
     * @returns {boolean} True if there is at least one method route, false otherwise.
     */
    const isMethodRoute = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter(
        (input) => input.type === "Methods" && !_.isUndefined(input.methods)
      ).length > 0;

    /**
     * Checks if there is at least one input of type "ListBox" in the given array of ModuleSpecsInputs.
     * @param {ModuleSpecsInputs[]} inputs - An array of ModuleSpecsInputs to check.
     * @returns {boolean} True if there is at least one input of type "ListBox", false otherwise.
     */
    const isParamsRoute = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.type === "ListBox").length > 0;

    return requestNodes.map((node) => {
      if (_.isUndefined(node.inputs)) node.inputs = [];
      if (!isInputRoute(node.inputs))
        node.inputs = [
          {
            name: "apiEndpoint",
            label: "API End point",
            type: "Route",
            required: true,
          },
          ...node.inputs,
        ];

      if (!isMethodRoute(node.inputs))
        node.inputs = [
          {
            name: "apiMethod",
            label: "Method",
            type: "Methods",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            required: true,
          },
          ...node.inputs,
        ];

      if (!isParamsRoute(node.inputs))
        node.inputs = [
          ...node.inputs,
          {
            name: "$url.params",
            label: "URL Parameters",
            type: "ListBox",
            listBoxSorting: true,
          },
        ];

      return node;
    });
  }

  /**
   * Builds middleware nodes for the given array of module nodes.
   * If the input array is empty, an empty array is returned.
   * If a node's controller is undefined, it is set to "default".
   * @param {ModuleNodes[]} middlewareNodes - An array of module nodes to build middleware nodes from.
   * @returns {ModuleNodes[]} - An array of middleware nodes with updated controllers.
   */
  private buildMiddlewareNodes(middlewareNodes: ModuleNodes[]): ModuleNodes[] {
    if (middlewareNodes.length === 0) return [];

    const { _ } = ecoFlow;
    return middlewareNodes.map((node) => {
      if (_.isUndefined(node.controller)) node.controller = "default";

      return node;
    });
  }

  /**
   * Builds debug nodes for the given module nodes array by adding necessary inputs if they are missing.
   * @param {ModuleNodes[]} debugNodes - The array of module nodes to build debug nodes for.
   * @returns {ModuleNodes[]} - The updated array of module nodes with added debug inputs.
   */
  private buildDebugNodes(debugNodes: ModuleNodes[]): ModuleNodes[] {
    if (debugNodes.length === 0) return [];

    const { _ } = ecoFlow;

    /**
     * Checks if the given array of ModuleSpecsInputs contains an input with the name "debugOutput".
     * @param {ModuleSpecsInputs[]} inputs - The array of ModuleSpecsInputs to check.
     * @returns {boolean} True if an input with the name "debugOutput" is found, false otherwise.
     */
    const isInputDebugOutput = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.name === "debugOutput").length > 0;

    /**
     * Checks if the given array of ModuleSpecsInputs contains an input with the name "debugExp".
     * @param {ModuleSpecsInputs[]} inputs - The array of inputs to check.
     * @returns {boolean} True if an input with the name "debugExp" is found, false otherwise.
     */
    const isInputExpression = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.name === "debugExp").length > 0;

    /**
     * Checks if the given array of ModuleSpecsInputs contains an input with the name "debugConsole".
     * @param {ModuleSpecsInputs[]} inputs - The array of ModuleSpecsInputs to check.
     * @returns {boolean} True if an input with the name "debugConsole" is found, false otherwise.
     */
    const isInputConsole = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.name === "debugConsole").length > 0;

    return debugNodes.map((node) => {
      if (_.isUndefined(node.inputs)) node.inputs = [];

      if (!isInputConsole(node.inputs))
        node.inputs = [
          {
            name: "debugConsole",
            label: "Consoles :",
            type: "CheckPicker",
            pickerOptions: ["WebConsole", "Terminal"],
            required: true,
            defaultValue: ["WebConsole"],
          },
          ...node.inputs,
        ];

      if (!isInputExpression(node.inputs))
        node.inputs = [
          {
            name: "debugExp",
            label: "Expression",
            type: "String",
          },
          ...node.inputs,
        ];

      if (!isInputDebugOutput(node.inputs))
        node.inputs = [
          {
            name: "debugOutput",
            label: "Output :",
            type: "SelectPicker",
            pickerOptions: ["Message", "Complete", "Expression"],
            required: true,
            defaultValue: "Complete",
          },
          ...node.inputs,
        ];

      return node;
    });
  }

  /**
   * Builds event listener nodes by adding necessary inputs if they are missing.
   * @param {ModuleNodes[]} eventListenerNodes - An array of module nodes representing event listeners.
   * @returns {ModuleNodes[]} - An array of module nodes with updated inputs.
   */
  private buildEventListenerNodes(
    eventListenerNodes: ModuleNodes[]
  ): ModuleNodes[] {
    /**
     * Check if the length of eventListenerNodes array is 0, if true, return an empty array.
     * @param {Array} eventListenerNodes - The array of event listener nodes to check.
     * @returns {Array} An empty array if eventListenerNodes length is 0.
     */
    if (eventListenerNodes.length === 0) return [];

    const { _ } = ecoFlow;

    /**
     * Checks if the given array of ModuleSpecsInputs contains an input with the name "eventChannel".
     * @param {ModuleSpecsInputs[]} inputs - The array of ModuleSpecsInputs to check.
     * @returns {boolean} True if the array contains an input with the name "eventChannel", false otherwise.
     */
    const isInputEventChannel = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.name === "eventChannel").length > 0;

    /**
     * Checks if the given array of ModuleSpecsInputs contains an input with the name "listenerMode".
     * @param {ModuleSpecsInputs[]} inputs - The array of ModuleSpecsInputs to check.
     * @returns {boolean} True if an input with the name "listenerMode" is found, false otherwise.
     */
    const isInputListenerMode = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.name === "listenerMode").length > 0;

    return eventListenerNodes.map((node) => {
      if (_.isUndefined(node.inputs)) node.inputs = [];

      if (!isInputEventChannel(node.inputs))
        node.inputs = [
          {
            name: "eventChannel",
            label: "Event Channel",
            type: "String",
            required: true,
          },
          ...node.inputs,
        ];

      if (!isInputListenerMode(node.inputs))
        node.inputs = [
          {
            name: "listenerMode",
            label: "Listener Mode",
            type: "SelectPicker",
            pickerOptions: ["ON", "ONCE", "ANY"],
            required: true,
            defaultValue: "ON",
          },
          ...node.inputs,
        ];

      return node;
    });
  }

  /**
   * Builds event emitter nodes by adding necessary inputs to each node in the provided array of event listener nodes.
   * @param {ModuleNodes[]} eventListenerNodes - An array of ModuleNodes representing event listener nodes.
   * @returns {ModuleNodes[]} - An array of ModuleNodes with added inputs for emitterPayload and eventChannel.
   */
  private buildEventEmitterNodes(
    eventListenerNodes: ModuleNodes[]
  ): ModuleNodes[] {
    /**
     * Check if the length of eventListenerNodes array is 0 and return an empty array if true.
     * @param {Array} eventListenerNodes - The array of event listener nodes to check.
     * @returns {Array} An empty array if eventListenerNodes length is 0, otherwise returns the eventListenerNodes array.
     */
    if (eventListenerNodes.length === 0) return [];

    const { _ } = ecoFlow;

    /**
     * Checks if the given array of ModuleSpecsInputs contains an input with the name "eventChannel".
     * @param {ModuleSpecsInputs[]} inputs - The array of ModuleSpecsInputs to check.
     * @returns {boolean} True if the array contains an input with the name "eventChannel", false otherwise.
     */
    const isInputEventChannel = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.name === "eventChannel").length > 0;

    /**
     * Checks if the given array of ModuleSpecsInputs contains an input with the name "emitterPayload".
     * @param {ModuleSpecsInputs[]} inputs - The array of ModuleSpecsInputs to check.
     * @returns {boolean} True if an input with the name "emitterPayload" is found, false otherwise.
     */
    const isInputEmitterPayload = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.name === "emitterPayload").length > 0;

    return eventListenerNodes.map((node) => {
      if (_.isUndefined(node.inputs)) node.inputs = [];

      if (!isInputEmitterPayload(node.inputs))
        node.inputs = [
          {
            name: "emitterPayload",
            label: "Emitter Payload",
            type: "String",
            required: true,
          },
          ...node.inputs,
        ];

      if (!isInputEventChannel(node.inputs))
        node.inputs = [
          {
            name: "eventChannel",
            label: "Event Channel",
            type: "String",
            required: true,
          },
          ...node.inputs,
        ];

      return node;
    });
  }

  /**
   * Builds and modifies response nodes for a given array of ModuleNodes.
   * @param {ModuleNodes[]} responseNodes - An array of ModuleNodes representing response nodes.
   * @returns {ModuleNodes[]} - An array of modified ModuleNodes with response key inputs added if missing.
   */
  private buildResponseNode(responseNodes: ModuleNodes[]): ModuleNodes[] {
    if (responseNodes.length === 0) return [];

    const { _ } = ecoFlow;

    /**
     * Checks if the given array of ModuleSpecsInputs contains an input with the name "responseKey".
     * @param {ModuleSpecsInputs[]} inputs - The array of ModuleSpecsInputs to check.
     * @returns {boolean} True if an input with the name "responseKey" is found, false otherwise.
     */
    const isInputResponseKey = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.name === "responseKey").length > 0;

    return responseNodes.map((node) => {
      if (_.isUndefined(node.inputs)) node.inputs = [];
      if (!isInputResponseKey(node.inputs))
        node.inputs = [
          {
            name: "responseKey",
            label: "Response key:",
            type: "String",
            required: true,
            defaultValue: "msg",
          },
          ...node.inputs,
        ];

      return node;
    });
  }

  /**
   * Asynchronously builds an array of ModuleNodes by extracting nodes from different sources
   * and setting up event listeners for systemSocket connections.
   * @returns {Promise<ModuleNodes[]>} A promise that resolves to an array of ModuleNodes.
   */
  async buildNodes(): Promise<ModuleNodes[]> {
    const { _, server, ecoModule } = ecoFlow;
    const {
      requestNodes,
      middlewareNodes,
      responseNodes,
      consoleNodes,
      eventListenerNodes,
      eventEmitterNodes,
    } = this.extractNodes;

    /**
     * Builds an array of nodes by concatenating the arrays of request nodes, middleware nodes,
     * response nodes, and debug nodes.
     * @param {Array} requestNodes - Array of request nodes to be included in the final array.
     * @param {Array} middlewareNodes - Array of middleware nodes to be included in the final array.
     * @param {Array} responseNodes - Array of response nodes to be included in the final array.
     * @param {Array} consoleNodes - Array of debug nodes to be included in the final array.
     * @returns {Array} An array of nodes containing all the concatenated nodes.
     */
    const nodes = [
      ...this.buildConfigurationsNodes(),
      ...this.buildRequestNodes(requestNodes),
      ...this.buildMiddlewareNodes(middlewareNodes),
      ...this.buildResponseNode(responseNodes),
      ...this.buildDebugNodes(consoleNodes),
      ...this.buildEventListenerNodes(eventListenerNodes),
      ...this.buildEventEmitterNodes(eventEmitterNodes),
    ];

    /**
     * Listens for connections on the system socket and sets up event listeners for each node ID.
     * When a message is received on a specific node ID, it emits a response after processing the message.
     * @param {Socket} socket - The socket connection object.
     * @returns None
     */
    server.systemSocket.on("connection", (socket) => {
      const nodesID = nodes.map((node) => node.id._id);
      nodesID.map((nodeID) => {
        if (!socket.eventNames().includes(nodeID))
          socket.on(nodeID, async (value) => {
            if (!_.isEmpty(value))
              socket.emit(nodeID, await ecoModule.getNodes(nodeID, value));
          });
      });
    });

    return nodes;
  }
}
