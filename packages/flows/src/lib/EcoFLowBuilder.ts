import {
  FlowsConfigurations,
  FlowsDataTypes,
  EcoFLowBuilder as IEcoFLowBuilder,
  ModuleTypes,
  NodeConfiguration,
} from "@ecoflow/types";
import type { Edge, Node } from "@reactflow/core";

export class EcoFLowBuilder implements IEcoFLowBuilder {
  constructor() {}

  async build(flowConfigurations: FlowsConfigurations): Promise<void> {
    const flows = Object.keys(flowConfigurations);
    const nodes: Node<FlowsDataTypes, ModuleTypes>[] = [];
    const edges: Edge[] = [];
    const configurations: NodeConfiguration[] = [];
    const respopnseNodes: Node<FlowsDataTypes, ModuleTypes>[] = [];
    const debugNodes: Node<FlowsDataTypes, ModuleTypes>[] = [];
    const connectionList: any[] = [];

    flows.map((flow) => {
      nodes.push(
        ...flowConfigurations[flow].definitions.filter(
          (node) => node.type !== "Response" && node.type !== "Debug"
        )
      );
      respopnseNodes.push(
        ...flowConfigurations[flow].definitions.filter(
          (node) => node.type === "Response"
        )
      );
      debugNodes.push(
        ...flowConfigurations[flow].definitions.filter(
          (node) => node.type === "Debug"
        )
      );
      edges.push(...flowConfigurations[flow].connections);
      configurations.push(...flowConfigurations[flow].configurations);
    });
  }
}
