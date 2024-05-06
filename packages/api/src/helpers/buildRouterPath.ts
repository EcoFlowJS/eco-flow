import { API_METHODS, NodeRequestController } from "@ecoflow/types";

/**
 * Builds a router path based on the provided API configurations.
 * @param {NodeRequestController} apiConfigs - The API configurations object.
 * @returns An array containing the API method and the formatted path.
 */
const buildRouterPath = (
  apiConfigs: NodeRequestController
): [API_METHODS, string] => {
  const { _ } = ecoFlow;
  if (_.isString(apiConfigs)) {
    const [method, path] = apiConfigs.split(" ");
    return [<API_METHODS>method, `/${path.replace(/^\/+|\/+$/g, "")}`];
  }

  /**
   * Checks if the apiMethod property in apiConfigs is undefined or empty, and if so, assigns it the value "GET".
   * @param {Object} apiConfigs - The object containing API configurations.
   * @returns None
   */
  if (_.isUndefined(apiConfigs.apiMethod) || _.isEmpty(apiConfigs.apiMethod))
    apiConfigs.apiMethod = "GET";

  /**
   * Checks if the apiEndpoint property in the apiConfigs object is undefined or empty,
   * and sets it to an empty string if it is.
   * @param {Object} apiConfigs - The object containing API configurations.
   * @returns None
   */
  if (
    _.isUndefined(apiConfigs.apiEndpoint) ||
    _.isEmpty(apiConfigs.apiEndpoint)
  )
    apiConfigs.apiEndpoint = "";

  /**
   * Checks if the "$url.params" key is undefined or empty in the apiConfigs object.
   * If it is, assigns an empty array to it.
   * @param {Object} apiConfigs - The object containing API configurations.
   * @returns None
   */
  if (
    _.isUndefined(apiConfigs["$url.params"]) ||
    _.isEmpty(apiConfigs["$url.params"])
  )
    apiConfigs["$url.params"] = [];

  /**
   * Constructs a path by replacing leading and trailing slashes in the apiEndpoint string,
   * then appends each parameter from the $url.params array to the path.
   * @param {string} apiEndpoint - The base API endpoint string.
   * @param {string[]} $url.params - An array of parameter names to append to the path.
   * @returns {string} The constructed path with parameters included.
   */
  let path: string = apiConfigs.apiEndpoint.replace(/^\/+|\/+$/g, "");
  apiConfigs["$url.params"].map(
    (params: string) => (path = path + `/:${params}`)
  );

  return [apiConfigs.apiMethod, `/${path}`];
};

export default buildRouterPath;
