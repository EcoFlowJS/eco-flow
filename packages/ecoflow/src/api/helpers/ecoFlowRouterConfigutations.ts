import { configOptions } from "@ecoflow/types";

// EcoFlow Router Configutations
const ecoFlowRouterConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const {
    systemRouterOptionsPrefix,
    systemRouterOptionsMethods,
    systemRouterOptionsRouterPath,
    systemRouterOptionsSensitive,
    systemRouterOptionsStrict,
    systemRouterOptionsExclusive,
    systemRouterOptionsHost,
  } = configRequest;

  if (
    !_.isUndefined(systemRouterOptionsPrefix) ||
    !_.isUndefined(systemRouterOptionsMethods) ||
    !_.isUndefined(systemRouterOptionsRouterPath) ||
    !_.isUndefined(systemRouterOptionsSensitive) ||
    !_.isUndefined(systemRouterOptionsStrict) ||
    !_.isUndefined(systemRouterOptionsExclusive) ||
    !_.isUndefined(systemRouterOptionsHost)
  )
    configs.systemRouterOptions = Object.create({});

  if (
    !_.isUndefined(systemRouterOptionsPrefix) &&
    !_.isEmpty(systemRouterOptionsPrefix)
  )
    configs.systemRouterOptions!.prefix = (<string>(
      systemRouterOptionsPrefix
    )).startsWith("/")
      ? systemRouterOptionsPrefix
      : `/${systemRouterOptionsPrefix}`;

  if (
    !_.isUndefined(systemRouterOptionsMethods) &&
    !_.isEmpty(systemRouterOptionsMethods) &&
    _.isArray(systemRouterOptionsMethods)
  )
    configs.systemRouterOptions!.methods = systemRouterOptionsMethods;

  if (
    !_.isUndefined(systemRouterOptionsRouterPath) &&
    !_.isEmpty(systemRouterOptionsRouterPath)
  )
    configs.systemRouterOptions!.routerPath = systemRouterOptionsRouterPath;

  if (
    !_.isUndefined(systemRouterOptionsHost) &&
    !_.isEmpty(systemRouterOptionsHost)
  )
    configs.systemRouterOptions!.host = systemRouterOptionsHost;

  if (
    !_.isUndefined(systemRouterOptionsSensitive) &&
    _.isBoolean(systemRouterOptionsSensitive)
  )
    configs.systemRouterOptions!.sensitive = systemRouterOptionsSensitive;

  if (
    !_.isUndefined(systemRouterOptionsStrict) &&
    _.isBoolean(systemRouterOptionsStrict)
  )
    configs.systemRouterOptions!.strict = systemRouterOptionsStrict;

  if (
    !_.isUndefined(systemRouterOptionsExclusive) &&
    _.isBoolean(systemRouterOptionsExclusive)
  )
    configs.systemRouterOptions!.exclusive = systemRouterOptionsExclusive;
  return configs;
};

export default ecoFlowRouterConfigutations;
