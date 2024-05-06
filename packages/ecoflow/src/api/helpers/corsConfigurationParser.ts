import { configOptions } from "@ecoflow/types";

/**
 * Parses the CORS configuration from the given config request object.
 * @param {any} configRequest - The configuration request object containing CORS settings.
 * @returns {Promise<configOptions>} A promise that resolves to the parsed CORS configuration options.
 */
const corsConfigurationParser = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const {
    httpCorsEnabled,
    httpCorsOrigin,
    httpCorsAllowMethods,
    httpCorsExposeHeaders,
    httpCorsAllowHeaders,
    httpCorsMaxAge,
    httpCorsCredentials,
    httpCorsKeepHeadersOnError,
    httpCorsSecureContext,
    httpCorsPrivateNetworkAccess,
  } = configRequest;

  configs.httpCors = Object.create({});
  if (!_.isUndefined(httpCorsEnabled)) {
    if (httpCorsEnabled) {
      configs.httpCors!.enabled = true;

      if (!_.isUndefined(httpCorsOrigin) && !_.isEmpty(httpCorsOrigin))
        configs.httpCors!.origin = httpCorsOrigin;

      if (
        !_.isUndefined(httpCorsAllowMethods) &&
        !_.isEmpty(httpCorsAllowMethods) &&
        _.isArray(httpCorsAllowMethods)
      )
        configs.httpCors!.allowMethods = httpCorsAllowMethods;

      if (
        !_.isUndefined(httpCorsExposeHeaders) &&
        !_.isEmpty(httpCorsExposeHeaders)
      )
        configs.httpCors!.exposeHeaders = (<string>httpCorsExposeHeaders).split(
          ","
        );

      if (
        !_.isUndefined(httpCorsAllowHeaders) &&
        !_.isEmpty(httpCorsAllowHeaders)
      )
        configs.httpCors!.allowHeaders = (<string>httpCorsAllowHeaders).split(
          ","
        );

      if (
        !_.isUndefined(httpCorsMaxAge) &&
        !_.isEmpty(httpCorsMaxAge.toString())
      )
        configs.httpCors!.maxAge = httpCorsMaxAge.toString();

      if (
        !_.isUndefined(httpCorsCredentials) &&
        _.isBoolean(httpCorsCredentials)
      )
        configs.httpCors!.credentials = httpCorsCredentials;

      if (
        !_.isUndefined(httpCorsKeepHeadersOnError) &&
        _.isBoolean(httpCorsKeepHeadersOnError)
      )
        configs.httpCors!.keepHeadersOnError = httpCorsKeepHeadersOnError;

      if (
        !_.isUndefined(httpCorsSecureContext) &&
        _.isBoolean(httpCorsSecureContext)
      )
        configs.httpCors!.secureContext = httpCorsSecureContext;

      if (
        !_.isUndefined(httpCorsPrivateNetworkAccess) &&
        _.isBoolean(httpCorsPrivateNetworkAccess)
      )
        configs.httpCors!.privateNetworkAccess = httpCorsPrivateNetworkAccess;
    } else configs.httpCors!.enabled = false;
  }

  return configs;
};

export default corsConfigurationParser;
