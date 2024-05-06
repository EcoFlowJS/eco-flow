import path from "path";
import fse from "fs-extra";
import { ConnectionConfig, DB_Drivers, configOptions } from "@ecoflow/types";

/**
 * Configures the system database based on the provided configuration request.
 * @param {any} configRequest - The configuration request object containing database settings.
 * @returns {Promise<configOptions>} A promise that resolves to the configured database options.
 */
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

export default systemDatabaseConfigutations;
