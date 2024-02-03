import { configOptions } from "@eco-flow/types";
import fse from "fs-extra";
import path from "path";

// Server Configuration
const serverConfigurationParser = async (configRequest: any) => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const { Host, Port, httpStatic, httpsEnabled, httpsKey, httpsCert } =
    configRequest;

  if (!_.isUndefined(Host) && !_.isEmpty(Host)) configs.Host = Host;
  if (!_.isUndefined(Port) && !_.isEmpty(Port.toString()))
    configs.Port = Number(Port);
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

// Cors Configuration
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

// Directory Configutations
const directoryConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const { userDir, moduleDir, envDir, DB_Directory, httpStaticRoot } =
    configRequest;

  if (!_.isUndefined(userDir) && !_.isEmpty(userDir)) {
    if (
      !(await fse.exists(userDir)) ||
      !(await fse.lstat(userDir)).isDirectory()
    )
      throw "Given user directory is either not a directory or does not exist!!";
    configs.userDir = path.join(userDir).replace(/\\/g, "/");
  }

  if (!_.isUndefined(moduleDir) && !_.isEmpty(moduleDir)) {
    if (
      !(await fse.exists(moduleDir)) ||
      !(await fse.lstat(moduleDir)).isDirectory()
    )
      throw "Given module directory is either not a directory or does not exist!!";
    configs.moduleDir = path.join(moduleDir).replace(/\\/g, "/");
  }

  if (!_.isUndefined(envDir) && !_.isEmpty(envDir)) {
    if (!(await fse.exists(envDir)) || !(await fse.lstat(envDir)).isDirectory())
      throw "Given environment  directory is either not a directory or does not exist!!";
    configs.envDir = path.join(envDir).replace(/\\/g, "/");
  }

  if (!_.isUndefined(DB_Directory) && !_.isEmpty(DB_Directory)) {
    if (
      !(await fse.exists(DB_Directory)) ||
      !(await fse.lstat(DB_Directory)).isDirectory()
    )
      throw "Given databse directory is either not a directory or does not exist!!";
    configs.DB_Directory = path.join(DB_Directory).replace(/\\/g, "/");
  }

  if (!_.isUndefined(httpStaticRoot) && !_.isEmpty(httpStaticRoot)) {
    if (
      !(await fse.exists(httpStaticRoot)) ||
      !(await fse.lstat(httpStaticRoot)).isDirectory()
    )
      throw "Given static serve directory is either not a directory or does not exist!!";
    configs.httpStaticRoot = path.join(httpStaticRoot).replace(/\\/g, "/");
  }

  return configs;
};

// Flow Configutations
const flowConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const { flowFile, flowFilePretty } = configRequest;

  if (!_.isUndefined(flowFile) && !_.isEmpty(flowFile))
    configs.flowFile = (<string>flowFile).endsWith(".json")
      ? flowFile
      : `${flowFile}.json`;

  if (!_.isUndefined(flowFilePretty) && _.isBoolean(flowFilePretty))
    configs.flowFilePretty = flowFilePretty;
  return configs;
};

// TODO: Complete this
// Logging Configutations
const loggingConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  return configs;
};

// Editor Configutations
const editorConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const { editorEnabled, editorAdmin, editorFlow, editorSchema } =
    configRequest;

  if (!_.isUndefined(editorEnabled) && _.isBoolean(editorEnabled)) {
    configs.editor = Object.create({});
    if (editorEnabled) {
      configs.editor!.enabled = true;

      if (!_.isUndefined(editorAdmin) && _.isBoolean(editorAdmin))
        configs.editor!.admin = editorAdmin;
      if (!_.isUndefined(editorFlow) && _.isBoolean(editorFlow))
        configs.editor!.flow = editorFlow;
      if (!_.isUndefined(editorSchema) && _.isBoolean(editorSchema))
        configs.editor!.schema = editorSchema;
    } else configs.editor!.enabled = false;
  }
  return configs;
};

// TODO: Complete this
// System Database Configutations
const systemDatabaseConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  return configs;
};

const parseServerConfigHelper = async (
  configRequest: any
): Promise<configOptions> => {
  const { _, config } = ecoFlow;

  const configs: configOptions = {
    ...(await serverConfigurationParser(configRequest)),
    ...(await corsConfigurationParser(configRequest)),
    ...(await ecoFlowRouterConfigutations(configRequest)),
    ...(await apiRouterConfigutations(configRequest)),
    ...(await directoryConfigutations(configRequest)),
    ...(await flowConfigutations(configRequest)),
    ...(await loggingConfigutations(configRequest)),
    ...(await editorConfigutations(configRequest)),
    ...(await systemDatabaseConfigutations(configRequest)),
  };

  console.log(configs);

  return configs;
};

export default parseServerConfigHelper;
