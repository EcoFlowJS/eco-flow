import { ConnectionConfig, DB_Drivers, configOptions } from "@eco-flow/types";
import fse from "fs-extra";
import path from "path";

// Server Configuration
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

// Logging Configutations
const loggingConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const {
    loggingEnabled,
    loggingLevel,
    loggingFormat,
    loggingPrettyPrint,
    loggingLableEnable,
    loggingLableLable,
    loggingConsole,
    loggingFileEnabled,
    loggingFileLocation,
    loggingFileFilename,
    loggingWebEnabled,
    loggingWebHost,
    loggingWebPort,
    loggingWebPath,
  } = configRequest;

  if (!_.isUndefined(loggingEnabled) && _.isBoolean(loggingEnabled)) {
    configs.logging = Object.create({});
    if (loggingEnabled) {
      configs.logging!.enabled = true;

      if (
        !_.isUndefined(loggingLevel) &&
        !_.isEmpty(loggingLevel.toString()) &&
        _.isNumber(loggingLevel)
      )
        configs.logging!.level = loggingLevel;

      if (!_.isUndefined(loggingFormat) && !_.isEmpty(loggingFormat))
        configs.logging!.format = loggingFormat;

      if (!_.isUndefined(loggingPrettyPrint) && _.isBoolean(loggingPrettyPrint))
        configs.logging!.prettyPrint = loggingPrettyPrint;

      if (
        !_.isUndefined(loggingLableEnable) &&
        _.isBoolean(loggingLableEnable)
      ) {
        configs.logging!.lable = Object.create({});
        if (loggingLableEnable) {
          configs.logging!.lable!.enable = true;
          if (
            !_.isUndefined(loggingLableLable) &&
            !_.isEmpty(loggingLableLable)
          )
            configs.logging!.lable!.lable = loggingLableLable;
        } else configs.logging!.lable!.enable = false;
      }
    } else configs.logging!.enabled = false;

    if (!_.isUndefined(loggingConsole) && _.isBoolean(loggingConsole))
      configs.logging!.console = loggingConsole;
    if (!_.isUndefined(loggingFileEnabled) && _.isBoolean(loggingFileEnabled)) {
      configs.logging!.file = Object.create({});
      if (loggingFileEnabled) {
        configs.logging!.file!.enabled = true;

        if (
          !_.isUndefined(loggingFileLocation) &&
          !_.isEmpty(loggingFileLocation)
        ) {
          if (
            !(await fse.exists(loggingFileLocation)) ||
            !(await fse.lstat(loggingFileLocation)).isDirectory()
          )
            throw "Logging File Directoty does not exist or is not a directory.";
          configs.logging!.file!.location = path
            .join(loggingFileLocation)
            .replace(/\\/g, "/");
        }

        if (
          !_.isUndefined(loggingFileFilename) &&
          !_.isEmpty(loggingFileFilename)
        )
          configs.logging!.file!.filename = (<string>(
            loggingFileFilename
          )).endsWith(".log")
            ? loggingFileFilename
            : `${loggingFileFilename}.log`;
      } else configs.logging!.file!.enabled = false;
    }

    if (!_.isUndefined(loggingWebEnabled) && _.isBoolean(loggingWebEnabled)) {
      configs.logging!.web = Object.create({});
      if (loggingWebEnabled) {
        configs.logging!.web!.enabled = true;

        if (!_.isUndefined(loggingWebHost) && !_.isEmpty(loggingWebHost))
          configs.logging!.web!.host = loggingWebHost;

        if (
          !_.isUndefined(loggingWebPort) &&
          !_.isEmpty(loggingWebPort.toString()) &&
          _.isNumber(parseInt(loggingWebPort)) &&
          parseInt(loggingWebPort) !== 0
        )
          configs.logging!.web!.port = loggingWebPort;

        if (!_.isUndefined(loggingWebPath) && !_.isEmpty(loggingWebPath))
          configs.logging!.web!.host = loggingWebPath;
      } else configs.logging!.web!.enabled = false;
    }
  }

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

// System Database Configutations
const systemDatabaseConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const {
    databaseDriver,
    databaseConfigurationConnectionString,
    databaseConfigurationFilename,
    databaseConfigurationHost,
    databaseConfigurationPort,
    databaseConfigurationUser,
    databaseConfigurationPassword,
    databaseConfigurationDatabase,
    databaseConfigurationSsl,
  } = configRequest;

  if (!_.isUndefined(databaseDriver) && !_.isEmpty(databaseDriver)) {
    const databaseConfig: {
      driver: DB_Drivers;
      configuration: ConnectionConfig;
    } = Object.create({});
    const { database, log } = ecoFlow;

    const processMarinaDB = (): ConnectionConfig => {
      const dbConfig: ConnectionConfig = Object.create({});

      if (
        !_.isUndefined(databaseConfigurationHost) &&
        !_.isEmpty(databaseConfigurationHost)
      )
        dbConfig.host = databaseConfigurationHost;

      if (
        !_.isUndefined(databaseConfigurationPort) &&
        !_.isEmpty(databaseConfigurationPort.toString()) &&
        _.isNumber(parseInt(databaseConfigurationPort)) &&
        parseInt(databaseConfigurationPort) > 0
      )
        dbConfig.port = databaseConfigurationPort;

      if (
        !_.isUndefined(databaseConfigurationUser) &&
        !_.isEmpty(databaseConfigurationUser)
      )
        dbConfig.user = databaseConfigurationUser;

      if (
        !_.isUndefined(databaseConfigurationPassword) &&
        !_.isEmpty(databaseConfigurationPassword)
      )
        dbConfig.password = databaseConfigurationPassword;

      if (
        !_.isUndefined(databaseConfigurationDatabase) &&
        !_.isEmpty(databaseConfigurationDatabase)
      )
        dbConfig.database = databaseConfigurationDatabase;

      if (
        !_.isUndefined(databaseConfigurationSsl) &&
        _.isBoolean(databaseConfigurationSsl)
      )
        dbConfig.ssl = databaseConfigurationSsl;

      return dbConfig;
    };

    log.info("Validating database connection configuration");
    switch (databaseDriver) {
      case "MongoDB":
        if (
          !_.isUndefined(databaseConfigurationConnectionString) &&
          !_.isEmpty(databaseConfigurationConnectionString)
        ) {
          if (
            await database.validateConnection("MONGO", {
              connectionString: databaseConfigurationConnectionString,
            })
          ) {
            databaseConfig.driver = "MONGO";
            databaseConfig.configuration = {
              connectionString: databaseConfigurationConnectionString,
            };
          }
        }
        break;
      case "MySQL":
        const mysqlConfig = processMarinaDB();
        if (await database.validateConnection("MYSQL", mysqlConfig)) {
          databaseConfig.driver = "MYSQL";
          databaseConfig.configuration = mysqlConfig;
        }
        break;
      case "PostgreSQL":
        const pgsqlCoonfig = processMarinaDB();
        if (await database.validateConnection("PGSQL", pgsqlCoonfig)) {
          databaseConfig.driver = "PGSQL";
          databaseConfig.configuration = pgsqlCoonfig;
        }
        break;
      case "Sqlite":
        if (
          !_.isUndefined(databaseConfigurationFilename) &&
          !_.isEmpty(databaseConfigurationFilename)
        ) {
          const fileLoc = path.dirname(databaseConfigurationFilename);
          if (!(await fse.lstat(fileLoc)).isDirectory())
            throw "Given path is not a directory";
          if (
            await database.validateConnection("SQLite", {
              filename: (<string>databaseConfigurationFilename).endsWith(
                ".sqlite"
              )
                ? databaseConfigurationFilename
                : `${databaseConfigurationFilename}.sqlite`,
            })
          ) {
            databaseConfig.driver = "SQLite";
            databaseConfig.configuration = {
              filename: (<string>databaseConfigurationFilename).endsWith(
                ".sqlite"
              )
                ? databaseConfigurationFilename
                : `${databaseConfigurationFilename}.sqlite`,
            };
          }
        }
        break;
    }
    if (!_.isEmpty(databaseConfig)) configs.database = databaseConfig;
  }

  return configs;
};

const parseServerConfigHelper = async (
  configRequest: any
): Promise<configOptions> => {
  return {
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
};

export {
  serverConfigurationParser,
  corsConfigurationParser,
  ecoFlowRouterConfigutations,
  apiRouterConfigutations,
  directoryConfigutations,
  flowConfigutations,
  loggingConfigutations,
  editorConfigutations,
  systemDatabaseConfigutations,
};
export default parseServerConfigHelper;
