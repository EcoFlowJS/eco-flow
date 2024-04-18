import { FlowsDataTypes, ModuleTypes } from "@ecoflow/types";
import { Node } from "@reactflow/core";

const isEndNode = (node: Node<FlowsDataTypes, ModuleTypes>): boolean =>
  node.type === "Response" || node.type === "Debug";

export default isEndNode;
