import { FlowsNodeDataTypes, ModuleTypes } from "@ecoflow/types";
import { Node } from "@reactflow/core";

const isEndNode = (
  node: Node<FlowsNodeDataTypes, ModuleTypes | string | undefined>
): boolean => node.type === "Response" || node.type === "Debug";

export default isEndNode;
