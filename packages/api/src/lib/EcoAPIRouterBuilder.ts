import {
  EcoAPIRouterBuilder as IEcoAPIRouterBuilder,
  MiddlewareStack,
  ModuleSpecs,
  NodeConfiguration,
  NodeRequestController,
  NodesStack,
  RequestStack,
} from "@ecoflow/types";
import buildRoutePath from "../helpers/buildRoutePath";

export class EcoAPIRouterBuilder implements IEcoAPIRouterBuilder {
  private _stack: NodesStack;
  private _configurations: NodeConfiguration[];

  constructor(nodeStack: NodesStack, configurations: NodeConfiguration[]) {
    this._stack = nodeStack;
    this._configurations = configurations;
  }

  private get routerBuilderStacks(): [RequestStack, MiddlewareStack] {
    const requestStack: RequestStack = this._stack
      .map((node) => node[0])
      .filter((node, index, nodes) => nodes.indexOf(node) === index);

    const middlewareStack: MiddlewareStack = requestStack.map((node) => [
      node,
      this._stack.filter((n) => n[0].id === node.id),
    ]);

    return [requestStack, middlewareStack];
  }

  private async buildRouterRequestNode(
    controller: ModuleSpecs["controller"],
    inputs?: NodeConfiguration["configs"]
  ): Promise<string> {
    const { _, ecoModule } = ecoFlow;
    const nodeController: () => NodeRequestController = _.isString(controller)
      ? ecoModule
          .getModuleSchema(controller.split(".")[0])
          .getController(controller.split(".")[1])
      : controller ||
        function (this: NodeRequestController) {
          return this;
        };

    return buildRoutePath(await nodeController.call(inputs));
  }

  private async buildRouterRequestStack(requestStack: RequestStack) {
    const result: any[] = [];
    for await (const node of requestStack) {
      const { ecoModule } = ecoFlow;
      const { type, controller } = ecoModule.getNodes(node.data.moduleID._id)!;
      const inputs = this._configurations.find(
        (configuration) => configuration.nodeID === node.id
      )?.configs;

      if (type !== "Request") return node;

      result.push(await this.buildRouterRequestNode(controller, inputs));
    }

    return result;
  }

  async initializeBuilder(): Promise<IEcoAPIRouterBuilder> {
    const [requestStack, middlewareStack] = this.routerBuilderStacks;
    console.log(await this.buildRouterRequestStack(requestStack));

    return this;
  }
}
