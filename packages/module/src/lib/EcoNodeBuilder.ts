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

  private buildMiddlewareNodes(middlewareNodes: ModuleNodes[]) {
    if (middlewareNodes.length === 0) return [];

    const { _ } = ecoFlow;
    return middlewareNodes.map((node) => {
      if (_.isUndefined(node.controller))
        node.controller = (payload: any) => payload;

      return node;
    });
  }

  async buildNodes(): Promise<ModuleNodes[]> {
    const { requestNodes, middlewareNodes, responseNodes, consoleNodes } =
      this.extractNodes;

    return [
      ...this.buildRequestNodes(requestNodes),
      ...this.buildMiddlewareNodes(middlewareNodes),
      ...responseNodes,
      ...consoleNodes,
    ];
  }
}
