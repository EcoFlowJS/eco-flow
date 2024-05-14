import { Context } from "koa";
import { ApiResponse, userTableCollection } from "@ecoflow/types";
import systemDatabaseConfigutations from "../../../helpers/systemDatabaseConfigutations";
import defaultModules from "../../../../defaults/defaultModules";

interface TimeSpansSteup {
  initTimeSpan: Date;
  DB_UpdateTimeSpan: Date;
  userCredentialsStarts: Date;
  userCredentialsUpdated: Date;
}

/**
 * Processes the setup for a blank context by creating user credentials, updating database configuration,
 * and restarting the server if necessary.
 * @param {Context} ctx - The context object containing the request information.
 * @returns None
 */
const processSetupBlank = async (ctx: Context) => {
  const { database, server, config, log, service, ecoModule } = ecoFlow;
  const { RoleService, UserService, AuditLogsService } = service;

  const timeSpans: TimeSpansSteup = Object.create({});
  timeSpans["initTimeSpan"] = new Date();

  const { databaseInfo, userInfo } = ctx.request.body;

  /**
   * Updates the database configuration based on the provided database information.
   * If the database information does not use default values, it updates the database
   * configuration with environment variables. It then validates the database connection,
   * sets the new configuration, and updates the database connection.
   * @param {DatabaseInfo} databaseInfo - The database information object.
   * @returns None
   */
  if (!databaseInfo.useDefault) {
    if (databaseInfo.envDatabase)
      databaseInfo.databaseConfigurationDatabase = `env(${databaseInfo.databaseConfigurationDatabase})`;
    if (databaseInfo.envMongoConnectionString)
      databaseInfo.databaseConfigurationConnectionString = `env(${databaseInfo.databaseConfigurationConnectionString})`;
    if (databaseInfo.envPassword)
      databaseInfo.databaseConfigurationPassword = `env(${databaseInfo.databaseConfigurationPassword})`;
    if (databaseInfo.envUsername)
      databaseInfo.databaseConfigurationUser = `env(${databaseInfo.databaseConfigurationUser})`;

    /**
     * Destructures the 'driver' and 'configuration' properties from the database object
     * obtained by calling the 'systemDatabaseConfigutations' function with the 'databaseInfo'.
     * @returns An object containing the 'driver' and 'configuration' properties.
     */
    const { driver, configuration } = {
      ...(await systemDatabaseConfigutations(databaseInfo)),
    }.database!;

    /**
     * Validates the database connection using the provided driver and configuration.
     * If the connection is not valid, it sets the response body to an error message.
     * @param {Driver} driver - The database driver to use for the connection.
     * @param {Configuration} configuration - The database configuration to validate.
     * @returns None
     */
    if (!(await database.validateConnection(driver, configuration))) {
      ctx.body = <ApiResponse>{
        error: true,
        payload: "Database configuration validation failed.",
      };
      return;
    }

    /**
     * Sets the configuration for the database using the provided driver and configuration.
     * @param {Object} config - The configuration object containing database settings.
     * @param {string} config.driver - The driver to be used for the database.
     * @param {Object} config.configuration - The configuration settings for the database driver.
     * @returns {Promise<void>} A promise that resolves once the configuration is set.
     */
    await config.setConfig({
      database: {
        driver,
        configuration,
      },
    });

    /**
     * Updates the database configuration with the provided driver and configuration.
     * @param {string} driver - The driver to be used for the database connection.
     * @param {object} configuration - The new configuration settings for the database.
     * @returns None
     */
    log.info("Updating database configuration");
    await database.updateDatabaseConnection("_sysDB", driver, configuration);
    log.info("Database configuration updated");
    timeSpans["DB_UpdateTimeSpan"] = new Date();
  }

  /**
   * Creates user credentials by creating a new role with admin privileges and then
   * creating a new user with the provided user information.
   * @param {object} userInfo - An object containing user information like name, username, password, email, etc.
   * @returns None
   */
  log.info("Creating user credentials...");
  timeSpans["userCredentialsStarts"] = new Date();

  /**
   * Creates a new role with the given name, default status, and permissions.
   * @param {string} name - The name of the role to create.
   * @param {boolean} isDefault - Whether the role is a default role.
   * @param {object} permissions - The permissions object for the role.
   * @returns {object} An object containing the _id of the newly created role.
   */
  const id: { _id: any } = (await RoleService.createRole(
    {
      name: "admin",
      isDefault: true,
      permissions: {},
    },
    null,
    true
  )) as { _id: any };

  const userCredentials: userTableCollection = {
    name: userInfo.name,
    username: userInfo.username,
    password: userInfo.password,
    roles: [id._id],
    email: userInfo.email,
    isActive: true,
  };

  /**
   * Creates a new user using the provided user credentials.
   * @param {UserCredentials} userCredentials - The credentials of the user to create.
   * @param {boolean} flag - A boolean flag indicating whether to perform a specific action.
   * @returns {Promise<Response>} A promise that resolves to the response of the user creation request.
   */
  const response = await UserService.createUser(userCredentials, true);
  log.info("User credentials created successfully");
  timeSpans["userCredentialsUpdated"] = new Date();

  /**
   * Asynchronously iterates over the defaultModules array and installs each module using ecoModule.
   * @param {Array} defaultModules - An array of modules to be installed.
   * @returns None
   */
  log.info("Installing default modules using ecoModule");
  for await (const module of defaultModules)
    await ecoModule.installModule(module);

  /**
   * Sets the response body with ApiResponse structure.
   * @param {ApiResponse} response - The response object containing success status and payload.
   * @returns None
   */
  ctx.body = <ApiResponse>{
    ...response,
    payload: response.success
      ? {
          msg: response.payload + "Restarting server in 5seconds...",
          restart: true,
        }
      : response.payload,
  };
  log.info("Restarting server in 5seconds...");

  /**
   * Adds a log entry to the audit logs service with information about the server setup process.
   * @param {Object} logDetails - The details of the log entry.
   * @param {string} logDetails.timeSpan - The time span of the log entry.
   * @param {string} logDetails.message - The message to be logged.
   * @param {string} logDetails.type - The type of log entry (e.g., Info, Error).
   * @param {string} logDetails.userID - The user ID associated with the log entry.
   * @returns None
   */
  await AuditLogsService.addLog({
    timeSpan: timeSpans.initTimeSpan,
    message: `Server setup process started`,
    type: "Info",
    userID: "SYSTEM_LOG",
  });

  /**
   * Adds a log entry to the audit logs service.
   * @param {Object} logData - The data object containing log information.
   * @param {string} logData.timeSpan - The time span for the log entry.
   * @param {string} logData.message - The message to be logged.
   * @param {string} logData.type - The type of log entry (e.g., Info, Error).
   * @param {string} logData.userID - The user ID associated with the log entry.
   * @returns None
   */
  await AuditLogsService.addLog({
    timeSpan: timeSpans.DB_UpdateTimeSpan,
    message: `Server database configuration validated and updated successfully`,
    type: "Info",
    userID: "SYSTEM_LOG",
  });

  /**
   * Adds a log entry to the audit logs service.
   * @param {Object} logData - The data for the log entry.
   * @param {string} logData.timeSpan - The time span for the log entry.
   * @param {string} logData.message - The message for the log entry.
   * @param {string} logData.type - The type of the log entry.
   * @param {string} logData.userID - The user ID associated with the log entry.
   * @returns None
   */
  await AuditLogsService.addLog({
    timeSpan: timeSpans.userCredentialsStarts,
    message: `User credentials creation started`,
    type: "Info",
    userID: "SYSTEM_LOG",
  });

  /**
   * Adds a log entry to the audit logs service.
   * @param {Object} logData - The data object containing log information.
   * @param {string} logData.timeSpan - The time span for the log entry.
   * @param {string} logData.message - The message to be logged.
   * @param {string} logData.type - The type of log entry (e.g., Info, Error).
   * @param {string} logData.userID - The user ID associated with the log entry.
   * @returns None
   */
  await AuditLogsService.addLog({
    timeSpan: timeSpans.userCredentialsUpdated,
    message: `User credentials created successfully`,
    type: "Info",
    userID: "SYSTEM_LOG",
  });

  /**
   * Adds a log entry to the audit logs service indicating that the server is being restarted.
   * @param {Object} logData - The data object containing the log information.
   * @param {string} logData.message - The message to be logged.
   * @param {string} logData.type - The type of log entry (e.g., Info, Error).
   * @param {string} logData.userID - The user ID associated with the log entry.
   * @returns None
   */
  await AuditLogsService.addLog({
    message: `Restarting server`,
    type: "Info",
    userID: "SYSTEM_LOG",
  });

  /**
   * Sets a timer that calls the restartServer method of the server object after 5 seconds.
   * @returns None
   */
  setTimeout(() => server.restartServer(), 5 * 1000);
};

export default processSetupBlank;
