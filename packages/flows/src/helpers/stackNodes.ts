import {
  FlowsEdgeDataTypes,
  FlowsNodeDataTypes,
  ModuleTypes,
  NodesStack,
} from "@ecoflow/types";
import { Edge, Node } from "@reactflow/core";
import isEndNode from "./isEndNode";

const stackNodes = (
  connectionLists: NodesStack,
  nodes: Node<FlowsNodeDataTypes, ModuleTypes | string | undefined>[],
  edges: Edge<FlowsEdgeDataTypes>[]
): NodesStack => {
  const { _ } = ecoFlow;
  const finalConnectionStack: NodesStack = [];

  while (connectionLists.length > 0) {
    connectionLists.forEach((connectionList, index) => {
      const connections = edges.filter(
        (edge) => edge.source === connectionList[connectionList.length - 1].id
      );

      const nextNodes =
        connections.length > 0 && connections.length === 1
          ? nodes.filter((node) => node.id === connections[0].target)
          : connections.map((connection) => {
              const nextNode = nodes.filter(
                (node) => node.id === connection.target
              );
              if (nextNode.length > 0) return nextNode[0];
            });

      if (_.isEmpty(nextNodes)) {
        connectionLists.splice(index, 1);
        return;
      }

      const node0 =
        nextNodes.length > 0 ? nextNodes.splice(0, 1)[0] : undefined;

      if (nextNodes.length > 0)
        nextNodes.map((node) => {
          if (!_.isUndefined(node))
            connectionLists.push([...connectionList, node]);
        });

      if (!_.isUndefined(node0)) connectionList.push(node0);
    });
    finalConnectionStack.push(
      ...connectionLists.filter((connection) =>
        isEndNode(connection[connection.length - 1])
      )
    );
    connectionLists = connectionLists.filter(
      (connection) => !isEndNode(connection[connection.length - 1])
    );
  }

  return finalConnectionStack;
};

export default stackNodes;
