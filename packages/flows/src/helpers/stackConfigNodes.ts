import {
  ConfigNodesStack,
  NodeConfiguration,
  NodeConnections,
  Nodes,
  NodesStack,
} from "@ecoflow/types";

/**
 * Stack configuration nodes based on the provided extract contents.
 * @param {Array} extractContents - An array containing Nodes, NodeConnections, NodeConfiguration, and NodesStack.
 * @returns {Promise<ConfigNodesStack>} A promise that resolves to a stack of configuration nodes.
 */
const stackConfigNodes = async (
  extractContents: [Nodes, NodeConnections, NodeConfiguration[], NodesStack]
): Promise<ConfigNodesStack> => {
  const { _ } = ecoFlow;

  /**
   * Filters out nodes of type "Configuration" that are not disabled from the given array of Nodes.
   * @param {Nodes} extractContents - The array of Nodes to filter from.
   * @returns An array of Nodes that are of type "Configuration" and not disabled.
   */
  const nodes: Nodes = extractContents[0].filter(
    (node) => node.type === "Configuration" && node.data.disabled === false
  );

  /**
   * Extracts unique module IDs from an array of nodes.
   * @param {Array} nodes - An array of nodes containing module data.
   * @returns {Array} An array of unique module IDs extracted from the nodes.
   */
  const moduleIDs = nodes
    .map((node) => node.data.moduleID._id)
    .filter(
      (moduleID, index, moduleIDs) => moduleIDs.indexOf(moduleID) === index
    );

  /**
   * Initialize a new empty ConfigNodesStack object using Object.create().
   * @type {ConfigNodesStack}
   */
  const resultStack: ConfigNodesStack = Object.create({});

  /**
   * Iterates through an array of module IDs and creates a stack of nodes and configurations
   * for each module ID.
   * @param {Array<string>} moduleIDs - An array of module IDs to iterate through.
   * @param {Array<Node>} nodes - An array of nodes to filter and stack based on module ID.
   * @param {Array<ExtractedContent>} extractContents - An array of extracted contents to find configurations.
   * @returns None
   */
  moduleIDs.forEach((moduleID) => {
    /**
     * Filters an array of nodes to return only the nodes whose data's moduleID _id matches the given moduleID.
     * @param {Nodes} nodes - The array of nodes to filter.
     * @param {string} moduleID - The moduleID to match against.
     * @returns An array of nodes that match the given moduleID.
     */
    const nodesStack: Nodes = nodes.filter(
      (n) => n.data.moduleID._id === moduleID
    );

    /**
     * Filters the nodes in the nodesStack array to only include nodes with a truthy 'id' property.
     * @returns An array of node IDs from the filtered nodes.
     */
    const nodeIDs = nodesStack.filter((n) => n.id);

    /**
     * Creates a stack of configurations based on the provided node IDs.
     * @param {Array} nodeIDs - An array of node IDs to extract configurations for.
     * @param {Array} extractContents - An array containing the extracted contents.
     * @returns {Array} A stack of configurations filtered to remove empty configurations.
     */
    const configStack = nodeIDs
      .map((n) => {
        const config = extractContents[2].find((cfg) => cfg.nodeID === n.id);

        if (!_.isUndefined(config)) return config;

        return {
          nodeID: n.id,
          configs: {},
        };
      })
      .filter((cfg) => !_.isEmpty(cfg.configs));

    /**
     * Assigns an object to the resultStack at the given moduleID key.
     * The object contains nodes and configurations.
     * @param {string} moduleID - The key to assign the object to in the resultStack.
     * @param {Array} nodes - The nodes to be assigned to the object.
     * @param {Array} configStack - The configurations to be assigned to the object.
     * @returns None
     */
    resultStack[moduleID] = {
      nodes: nodes,
      configurations: configStack,
    };
  });

  return resultStack;
};

export default stackConfigNodes;
