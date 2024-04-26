import { configOptions } from "@ecoflow/types";

// Api Router Configutations
const apiRouterConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const {
    apiRouterOptionsPrefix,
    apiRouterOptionsMethods,
    apiRouterOptionsRouterPath,
    apiRouterOptionsSensitive,
    apiRouterOptionsStrict,
    apiRouterOptionsExclusive,
    apiRouterOptionsHost,
  } = configRequest;

  if (
    !_.isUndefined(apiRouterOptionsPrefix) ||
    !_.isUndefined(apiRouterOptionsMethods) ||
    !_.isUndefined(apiRouterOptionsRouterPath) ||
    !_.isUndefined(apiRouterOptionsSensitive) ||
    !_.isUndefined(apiRouterOptionsStrict) ||
    !_.isUndefined(apiRouterOptionsExclusive) ||
    !_.isUndefined(apiRouterOptionsHost)
  )
    configs.apiRouterOptions = Object.create({});

  if (
    !_.isUndefined(apiRouterOptionsPrefix) &&
    !_.isEmpty(apiRouterOptionsPrefix)
  )
    configs.apiRouterOptions!.prefix = (<string>(
      apiRouterOptionsPrefix
    )).startsWith("/")
      ? apiRouterOptionsPrefix
      : `/${apiRouterOptionsPrefix}`;

  if (
    !_.isUndefined(apiRouterOptionsMethods) &&
    !_.isEmpty(apiRouterOptionsMethods) &&
    _.isArray(apiRouterOptionsMethods)
  )
    configs.apiRouterOptions!.methods = apiRouterOptionsMethods;

  if (
    !_.isUndefined(apiRouterOptionsRouterPath) &&
    !_.isEmpty(apiRouterOptionsRouterPath)
  )
    configs.apiRouterOptions!.routerPath = apiRouterOptionsRouterPath;

  if (!_.isUndefined(apiRouterOptionsHost) && !_.isEmpty(apiRouterOptionsHost))
    configs.apiRouterOptions!.host = apiRouterOptionsHost;

  if (
    !_.isUndefined(apiRouterOptionsSensitive) &&
    _.isBoolean(apiRouterOptionsSensitive)
  )
    configs.apiRouterOptions!.sensitive = apiRouterOptionsSensitive;

  if (
    !_.isUndefined(apiRouterOptionsStrict) &&
    _.isBoolean(apiRouterOptionsStrict)
  )
    configs.apiRouterOptions!.strict = apiRouterOptionsStrict;

  if (
    !_.isUndefined(apiRouterOptionsExclusive) &&
    _.isBoolean(apiRouterOptionsExclusive)
  )
    configs.apiRouterOptions!.exclusive = apiRouterOptionsExclusive;
  return configs;
};

export default apiRouterConfigutations;
