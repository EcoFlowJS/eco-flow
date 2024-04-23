import { API_METHODS, NodeRequestController } from "@ecoflow/types";

const buildRouterPath = (
  apiConfigs: NodeRequestController
): [API_METHODS, string] => {
  const { _ } = ecoFlow;
  if (_.isString(apiConfigs)) {
    const [method, path] = apiConfigs.split(" ");
    return [<API_METHODS>method, `/${path.replace(/^\/+|\/+$/g, "")}`];
  }

  if (_.isUndefined(apiConfigs.apiMethod) || _.isEmpty(apiConfigs.apiMethod))
    apiConfigs.apiMethod = "GET";

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

  return [apiConfigs.apiMethod, `/${path}`];
};

export default buildRouterPath;
