import { FlowsNodeDataTypes, ModuleTypes } from "@ecoflow/types";
import { Node } from "@reactflow/core";

/**
 * Checks if the given node is an end node by comparing its type to "Response" or "Debug".
 * @param {Node<FlowsNodeDataTypes, ModuleTypes | string | undefined>} node - The node to check.
 * @returns {boolean} True if the node is an end node, false otherwise.
 */
const isEndNode = (
  node: Node<FlowsNodeDataTypes, ModuleTypes | string | undefined>
): boolean =>
  node.type === "Response" ||
  node.type === "Debug" ||
  node.type === "EventEmitter";

export default isEndNode;
