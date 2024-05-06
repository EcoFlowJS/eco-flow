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
    const requestNodes: ModuleNodes[] = nodes.filter(
      (n) => n.type === "Request"
    );
    const middlewareNodes: ModuleNodes[] = nodes.filter(
      (n) => n.type === "Middleware"
    );
    const responseNodes: ModuleNodes[] = nodes.filter(
      (n) => n.type === "Response"
    );
    const consoleNodes: ModuleNodes[] = nodes.filter((n) => n.type === "Debug");

    return {
      requestNodes,
      middlewareNodes,
      responseNodes,
      consoleNodes,
    };
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
    const { requestNodes, middlewareNodes, responseNodes, consoleNodes } =
      this.extractNodes;

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
      ...this.buildRequestNodes(requestNodes),
      ...this.buildMiddlewareNodes(middlewareNodes),
      ...this.buildResponseNode(responseNodes),
      ...this.buildDebugNodes(consoleNodes),
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
