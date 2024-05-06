import fse from "fs-extra";
import { configOptions } from "@ecoflow/types";

/**
 * Parses the server configuration based on the provided config request object.
 * @param {any} configRequest - The configuration request object containing Host, Port, httpStatic, httpsEnabled, httpsKey, and httpsCert.
 * @returns {configOptions} The parsed server configuration options.
 * @throws Throws an error if key and certificate for HTTPS configuration are not provided or if key/cert files are not found.
 */
const serverConfigurationParser = async (configRequest: any) => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const { Host, Port, httpStatic, httpsEnabled, httpsKey, httpsCert } =
    configRequest;

  if (!_.isUndefined(Host) && !_.isEmpty(Host)) configs.Host = Host;
  if (
    !_.isUndefined(Port) &&
    !_.isEmpty(Port.toString()) &&
    _.isNumber(parseInt(Port)) &&
    parseInt(Port) !== 0
  )
    configs.Port = parseInt(Port);
  if (!_.isUndefined(httpStatic) && !_.isEmpty(httpStatic))
    configs.httpStatic = httpStatic;
  if (!_.isUndefined(httpsEnabled) && _.isBoolean(httpsEnabled)) {
    if (_.isUndefined(configs.https)) configs.https = Object.create({});
    configs.https!.enabled = httpsEnabled;
  }
  if (!_.isUndefined(httpsKey) && !_.isEmpty(httpsKey)) {
    if (_.isUndefined(configs.https)) configs.https = Object.create({});
    if (!_.isUndefined(configs.https?.enabled) && configs.https?.enabled)
      configs.https!.key = httpsKey;
  }
  if (!_.isUndefined(httpsCert) && !_.isEmpty(httpsCert)) {
    if (_.isUndefined(configs.https)) configs.https = Object.create({});
    if (!_.isUndefined(configs.https?.enabled) && configs.https?.enabled)
      configs.https!.cert = httpsCert;
  }

  if (
    configs.https?.enabled &&
    (_.isUndefined(configs.https.cert) ||
      _.isEmpty(configs.https.cert) ||
      _.isUndefined(configs.https.key) ||
      _.isEmpty(configs.https.key))
  )
    throw "Key and Certificate for HTTPS configuratio is not provided";

  if (configs.https?.enabled && !(await fse.exists(configs.https!.key!)))
    throw "Key file not found in " + configs.https!.key!;

  if (configs.https?.enabled && !(await fse.exists(configs.https!.cert!)))
    throw "Cert file not found in " + configs.https!.cert!;

  return configs;
};

export default serverConfigurationParser;
