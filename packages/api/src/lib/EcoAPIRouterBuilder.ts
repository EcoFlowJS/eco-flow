import {
  EcoAPIRouterBuilder as IEcoAPIRouterBuilder,
  NodeConfiguration,
  NodesStack,
} from "@ecoflow/types";

export class EcoAPIRouterBuilder implements IEcoAPIRouterBuilder {
  private _stack: NodesStack;
  private _configurations: NodeConfiguration[];

  constructor(nodeStack: NodesStack, configurations: NodeConfiguration[]) {
    this._stack = nodeStack;
    this._configurations = configurations;
  }

  async initializeBuilder(): Promise<IEcoAPIRouterBuilder> {
    return this;
  }
}
