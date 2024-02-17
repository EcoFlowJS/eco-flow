import { Context } from "koa";
import { systemDatabaseConfigutations } from "../../helpers/parseServerConfigHelper";
import {
  ApiResponse,
  configOptions,
  userTableCollection,
} from "@eco-flow/types";

const databaseValidator = async (ctx: Context) => {
  const { _ } = ecoFlow;
  const { useDefault } = ctx.request.body;
  ctx.status = 200;

  if (!useDefault) {
    const config: configOptions = {
      ...(await systemDatabaseConfigutations(ctx.request.body)),
    };

    if (_.isUndefined(config.database)) {
      ctx.body = <ApiResponse>{
        error: true,
        payload: "Invalid Database configuration.",
      };
      return;
    }
    ctx.body = <ApiResponse>{
      success: true,
      payload: "Database configuration Validation Success.",
    };
  }
};

const processSetupController = async (ctx: Context) => {
  const { database, server, config, log, service } = ecoFlow;

  const { databaseInfo, userInfo } = ctx.request.body;

  if (!databaseInfo.useDefault) {
    if (databaseInfo.envDatabase)
      databaseInfo.databaseConfigurationDatabase = `env(${databaseInfo.databaseConfigurationDatabase})`;
    if (databaseInfo.envMongoConnectionString)
      databaseInfo.databaseConfigurationConnectionString = `env(${databaseInfo.databaseConfigurationConnectionString})`;
    if (databaseInfo.envPassword)
      databaseInfo.databaseConfigurationPassword = `env(${databaseInfo.databaseConfigurationPassword})`;
    if (databaseInfo.envUsername)
      databaseInfo.databaseConfigurationUser = `env(${databaseInfo.databaseConfigurationUser})`;

    const { driver, configuration } = {
      ...(await systemDatabaseConfigutations(databaseInfo)),
    }.database!;

    if (!(await database.validateConnection(driver, configuration))) {
      ctx.body = <ApiResponse>{
        error: true,
        payload: "Database configuration validation failed.",
      };
      return;
    }

    await config.setConfig({
      database: {
        driver,
        configuration,
      },
    });

    log.info("Updating database configuration");
    await database.updateDatabaseConnection("_sysDB", driver, configuration);
    log.info("Database configuration updated");
  }

  log.info("creating user credentials...");
  const userCredentials: userTableCollection = {
    name: userInfo.name,
    username: userInfo.username,
    password: userInfo.password,
    email: userInfo.email,
    isActive: true,
  };
  const response = await service.UserService.createUser(userCredentials, true);
  log.info("User credentials created successfully");

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
  setTimeout(() => server.restartServer(), 5 * 1000);
};

export { databaseValidator, processSetupController };
