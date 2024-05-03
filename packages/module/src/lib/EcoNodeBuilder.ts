import {
  ExtractedRawNodes,
  EcoNodeBuilder as IEcoNodeBuilder,
  ModuleNodes,
  ModuleSchema,
  ModuleSpecsInputs,
} from "@ecoflow/types";

export class EcoNodeBuilder implements IEcoNodeBuilder {
  private _moduleSchema: ModuleSchema[];

  constructor(moduleSchema: ModuleSchema[]) {
    this._moduleSchema = moduleSchema;
  }

  private get getSchemaNodes(): ModuleNodes[] {
    const nodes: ModuleNodes[] = [];
    this._moduleSchema.map((m) => {
      if (m.module && m.module.nodes) nodes.push(...m.module.nodes);
    });
    return nodes;
  }

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

  private buildRequestNodes(requestNodes: ModuleNodes[]): ModuleNodes[] {
    if (requestNodes.length === 0) return [];
    const { _ } = ecoFlow;

    const isInputRoute = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.type === "Route").length > 0;

    const isMethodRoute = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter(
        (input) => input.type === "Methods" && !_.isUndefined(input.methods)
      ).length > 0;

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

  private buildMiddlewareNodes(middlewareNodes: ModuleNodes[]): ModuleNodes[] {
    if (middlewareNodes.length === 0) return [];

    const { _ } = ecoFlow;
    return middlewareNodes.map((node) => {
      if (_.isUndefined(node.controller)) node.controller = "default";

      return node;
    });
  }

  private buildDebugNodes(debugNodes: ModuleNodes[]): ModuleNodes[] {
    if (debugNodes.length === 0) return [];

    const { _ } = ecoFlow;

    const isInputDebugOutput = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.name === "debugOutput").length > 0;

    const isInputExpression = (inputs: ModuleSpecsInputs[]) =>
      inputs.filter((input) => input.name === "debugExp").length > 0;

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

  private buildResponseNode(responseNodes: ModuleNodes[]): ModuleNodes[] {
    if (responseNodes.length === 0) return [];

    const { _ } = ecoFlow;

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

  async buildNodes(): Promise<ModuleNodes[]> {
    const { _, server, ecoModule } = ecoFlow;
    const { requestNodes, middlewareNodes, responseNodes, consoleNodes } =
      this.extractNodes;

    const nodes = [
      ...this.buildRequestNodes(requestNodes),
      ...this.buildMiddlewareNodes(middlewareNodes),
      ...this.buildResponseNode(responseNodes),
      ...this.buildDebugNodes(consoleNodes),
    ];

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
