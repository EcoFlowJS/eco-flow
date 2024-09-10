import {
  FlowsEdgeDataTypes,
  FlowsNodeDataTypes,
  ModuleTypes,
  NodesStack,
} from "@ecoflow/types";
import { Edge, Node } from "@reactflow/core";
import isEndNode from "./isEndNode.js";

/**
 * Stack nodes based on the given connection lists, nodes, and edges.
 * @param {NodesStack} connectionLists - The list of connections between nodes.
 * @param {Node<FlowsNodeDataTypes, ModuleTypes | string | undefined>[]} nodes - The list of nodes.
 * @param {Edge<FlowsEdgeDataTypes>[]} edges - The list of edges between nodes.
 * @returns {NodesStack} The final stacked nodes based on the connections.
 */
const stackNodes = (
  connectionLists: NodesStack,
  nodes: Node<FlowsNodeDataTypes, ModuleTypes | string | undefined>[],
  edges: Edge<FlowsEdgeDataTypes>[]
): NodesStack => {
  const { _ } = ecoFlow;
  const finalConnectionStack: NodesStack = [];

  /**
   * Traverses a graph represented by nodes and edges to find all possible paths from
   * start to end nodes.
   * @param {Array} edges - The edges of the graph.
   * @param {Array} nodes - The nodes of the graph.
   * @param {Array} connectionLists - The list of connections to explore.
   * @param {Array} finalConnectionStack - The final list of connections that reach end nodes.
   * @returns None
   */
  while (connectionLists.length > 0) {
    connectionLists.forEach((connectionList, index) => {
      /**
       * Filters the edges array to find connections where the source matches the id of the last item in the connectionList array.
       * @param {Array} edges - The array of edges to filter.
       * @param {Array} connectionList - The list of connections to compare against.
       * @returns An array of connections that match the specified criteria.
       */
      const connections = edges.filter(
        (edge) => edge.source === connectionList[connectionList.length - 1].id
      );

      /**
       * Determines the next nodes in a graph based on the connections and nodes provided.
       * @param {Array} connections - An array of connections between nodes.
       * @param {Array} nodes - An array of nodes in the graph.
       * @returns An array of next nodes in the graph.
       */
      const nextNodes =
        connections.length > 0 && connections.length === 1
          ? nodes.filter((node) => node.id === connections[0].target)
          : connections.map((connection) => {
              const nextNode = nodes.filter(
                (node) => node.id === connection.target
              );
              if (nextNode.length > 0) return nextNode[0];
            });

      /**
       * If the list of nextNodes is empty, remove the connection list at the specified index from the connectionLists array.
       * @param {number} index - The index of the connection list to remove.
       * @returns None
       */
      if (_.isEmpty(nextNodes)) {
        connectionLists.splice(index, 1);
        return;
      }

      /**
       * Retrieves the first element from the array 'nextNodes' if it is not empty,
       * and removes that element from the array.
       * @param {Array} nextNodes - The array of nodes to retrieve the first element from.
       * @returns The first element of the array 'nextNodes', or undefined if the array is empty.
       */
      const node0 =
        nextNodes.length > 0 ? nextNodes.splice(0, 1)[0] : undefined;

      /**
       * Iterates over the elements in the nextNodes array and adds non-undefined elements to the connectionLists array.
       * @param {Array} nextNodes - The array of nodes to iterate over.
       * @returns None
       */
      if (nextNodes.length > 0)
        nextNodes.map((node) => {
          if (!_.isUndefined(node))
            connectionLists.push([...connectionList, node]);
        });

      /**
       * Checks if the node0 is not undefined and if so, adds it to the connectionList array.
       * @param {any} node0 - The node to check for undefined.
       * @returns None
       */
      if (!_.isUndefined(node0)) connectionList.push(node0);
    });

    /**
     * Pushes connections that end at a specific node to the final connection stack.
     * @param {Array<Array<any>>} connectionLists - The list of connections to filter.
     * @returns None
     */
    finalConnectionStack.push(
      ...connectionLists.filter((connection) =>
        isEndNode(connection[connection.length - 1])
      )
    );

    /**
     * Filters out connections that end at a specific node.
     * @param {Array} connectionLists - The list of connections to filter.
     * @returns A filtered list of connections that do not end at a specific node.
     */
    connectionLists = connectionLists.filter(
      (connection) => !isEndNode(connection[connection.length - 1])
    );
  }

  return finalConnectionStack;
};

export default stackNodes;
