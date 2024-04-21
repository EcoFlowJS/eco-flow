import { NodeRequestController } from "@ecoflow/types";

const buildRoutePath = (apiConfigs: NodeRequestController): string => {
  const { _ } = ecoFlow;
  if (_.isString(apiConfigs))
    return `${apiConfigs.split(" ")[0]} /${apiConfigs
      .split(" ")[1]
      .replace(/^\/+|\/+$/g, "")}`;

  if (
    _.isUndefined(apiConfigs.apiEndpoint) ||
    _.isEmpty(apiConfigs.apiEndpoint)
  )
    apiConfigs.apiEndpoint = "";
  if (
    _.isUndefined(apiConfigs["$url.params"]) ||
    _.isEmpty(apiConfigs["$url.params"])
  )
    apiConfigs["$url.params"] = [];

  let path: string = apiConfigs.apiEndpoint.replace(/^\/+|\/+$/g, "");
  apiConfigs["$url.params"].map(
    (params: string) => (path = path + `/:${params}`)
  );

  return `${apiConfigs.apiMethod} /${path}`;
};

export default buildRoutePath;
