import { configOptions, userTableCollection } from "@ecoflow/types";
import prepareDBMigration from "./prepareDBMigration";
import { Service } from "@ecoflow/services";

const migrateToNew = async (
  dbConfig: Required<configOptions>["database"],
  values: {
    name: string;
    username: string;
    password: string;
    email: string;
  }
): Promise<boolean> => {
  const { database, log } = ecoFlow;
  const { name, username, password, email } = values;
  const { driver, configuration } = dbConfig;

  if (!(await database.validateConnection(driver, configuration)))
    throw "Database configuration validation failed.";

  log.info("Creating connection to the new database...");
  const dbConnection: [boolean, string] = [false, ""];
  if (await database.getDatabaseConnection("_migrationDB")) {
    const [status, message] = await database.updateDatabaseConnection(
      "_migrationDB",
      driver,
      configuration
    );
    dbConnection[0] = status;
    dbConnection[1] = message;
  } else {
    const [status, message] = await database.addDatabaseConnection(
      "_migrationDB",
      driver,
      configuration,
      true
    );
    dbConnection[0] = status;
    dbConnection[1] = message;
  }

  const [status, message] = dbConnection;
  if (!status) {
    log.error(message);
    throw message;
  }
  log.info("Connection established to the new database");

  log.info("Preparing migration database");
  await prepareDBMigration(database.getDatabaseConnection("_migrationDB"));
  log.info("Migrating database contents...");

  log.info("Creating user credentials...");
  const { RoleService, UserService } = new Service("_migrationDB");

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
    name,
    username,
    password,
    roles: [id._id],
    email,
    isActive: true,
  };

  const { success, error } = await UserService.createUser(
    userCredentials,
    true
  );
  if (success) return true;
  if (error) return false;
  return false;
};

export default migrateToNew;
