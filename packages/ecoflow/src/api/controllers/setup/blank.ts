import { Context } from "koa";
import { systemDatabaseConfigutations } from "../../helpers/parseServerConfigHelper";
import { ApiResponse, configOptions } from "@eco-flow/types";

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
  const { database, server, config, log } = ecoFlow;

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

  //ToDo: create user credentials.
  console.log(userInfo);

  ctx.body = {};
};

export { databaseValidator, processSetupController };
