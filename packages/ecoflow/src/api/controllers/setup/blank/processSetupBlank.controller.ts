import { Context } from "koa";
import { ApiResponse, userTableCollection } from "@ecoflow/types";
import systemDatabaseConfigutations from "../../../helpers/systemDatabaseConfigutations";

interface TimeSpansSteup {
  initTimeSpan: Date;
  DB_UpdateTimeSpan: Date;
  userCredentialsStarts: Date;
  userCredentialsUpdated: Date;
}

const processSetupBlank = async (ctx: Context) => {
  const { database, server, config, log, service } = ecoFlow;

  const timeSpans: TimeSpansSteup = Object.create({});
  timeSpans["initTimeSpan"] = new Date();

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
    timeSpans["DB_UpdateTimeSpan"] = new Date();
  }

  log.info("Creating user credentials...");
  timeSpans["userCredentialsStarts"] = new Date();
  const id: { _id: any } = (await service.RoleService.createRole(
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

  const response = await service.UserService.createUser(userCredentials, true);
  log.info("User credentials created successfully");
  timeSpans["userCredentialsUpdated"] = new Date();

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
  await service.AuditLogsService.addLog({
    timeSpan: timeSpans.initTimeSpan,
    message: `Server setup process started`,
    type: "Info",
    userID: "SYSTEM_LOG",
  });
  await service.AuditLogsService.addLog({
    timeSpan: timeSpans.DB_UpdateTimeSpan,
    message: `Server database configuration validated and updated successfully`,
    type: "Info",
    userID: "SYSTEM_LOG",
  });
  await service.AuditLogsService.addLog({
    timeSpan: timeSpans.userCredentialsStarts,
    message: `User credentials creation started`,
    type: "Info",
    userID: "SYSTEM_LOG",
  });
  await service.AuditLogsService.addLog({
    timeSpan: timeSpans.userCredentialsUpdated,
    message: `User credentials created successfully`,
    type: "Info",
    userID: "SYSTEM_LOG",
  });
  await service.AuditLogsService.addLog({
    message: `Restarting server`,
    type: "Info",
    userID: "SYSTEM_LOG",
  });
  setTimeout(() => server.restartServer(), 5 * 1000);
};

export default processSetupBlank;
