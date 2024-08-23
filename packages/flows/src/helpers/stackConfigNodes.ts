import {
  ConfigNodesStack,
  NodeConfiguration,
  NodeConnections,
  Nodes,
  NodesStack,
} from "@ecoflow/types";

const stackConfigNodes = async (
  extractContents: [Nodes, NodeConnections, NodeConfiguration[], NodesStack]
): Promise<ConfigNodesStack> => {
  const { _ } = ecoFlow;

  const nodes: Nodes = extractContents[0].filter(
    (node) => node.type === "Configuration" && node.data.disabled === false
  );

  const moduleIDs = nodes
    .map((node) => node.data.moduleID._id)
    .filter(
      (moduleID, index, moduleIDs) => moduleIDs.indexOf(moduleID) === index
    );

  const resultStack: ConfigNodesStack = Object.create({});

  moduleIDs.forEach((moduleID) => {
    const nodesStack: Nodes = nodes.filter(
      (n) => n.data.moduleID._id === moduleID
    );
    const nodeIDs = nodesStack.filter((n) => n.id);
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

    resultStack[moduleID] = {
      nodes: nodes,
      configurations: configStack,
    };
  });

  return resultStack;
};

export default stackConfigNodes;
