import { configOptions } from "@ecoflow/types";

// Flow Configutations
const flowConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const {
    flowNodeDefinitions,
    flowNodeConnections,
    flowNodeConfigurations,
    flowFilePretty,
  } = configRequest;

  if (!_.isUndefined(flowNodeDefinitions) && !_.isEmpty(flowNodeDefinitions))
    configs.flowNodeDefinitions = flowNodeDefinitions.endsWith(".json")
      ? flowNodeDefinitions
      : `${flowNodeDefinitions}.json`;

  if (!_.isUndefined(flowNodeConnections) && !_.isEmpty(flowNodeConnections))
    configs.flowNodeConnections = flowNodeConnections.endsWith(".json")
      ? flowNodeConnections
      : `${flowNodeConnections}.json`;

  if (
    !_.isUndefined(flowNodeConfigurations) &&
    !_.isEmpty(flowNodeConfigurations)
  )
    configs.flowNodeConfigurations = flowNodeConfigurations.endsWith(".json")
      ? flowNodeConfigurations
      : `${flowNodeConfigurations}.json`;

  if (!_.isUndefined(flowFilePretty) && _.isBoolean(flowFilePretty))
    configs.flowFilePretty = flowFilePretty;
  return configs;
};

export default flowConfigutations;
