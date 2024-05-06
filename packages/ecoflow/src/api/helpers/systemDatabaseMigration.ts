import { Service } from "@ecoflow/services";
import {
  AuditLogSchemaStruct,
  FlowEditorSettingsConfigurations,
  Role,
  Tokens,
  configOptions,
  userTableCollection,
} from "@ecoflow/types";
import prepareDBMigration from "./prepareDBMigration";
import TPromise from "thread-promises";

/**
 * Creates a system database migration object that allows for migrating the database.
 * @param {configOptions} database - The database configuration options.
 * @returns An object with a 'migrate' method that can be used to migrate the database.
 */
const systemDatabaseMigration = ({ database }: configOptions) => {
  return {
    migrate: (byUser: string) => migrate.call(database, byUser),
  };
};

/**
 * Migrate data from the current database to a new database based on the provided configuration.
 * @param {string} userID - The ID of the user initiating the migration.
 * @returns None
 */
async function migrate(this: configOptions["database"], userID: string) {
  if (!this) return;
  const { _, log, service, database } = ecoFlow;

  const { driver, configuration } = this;
  const {
    AuditLogsService,
    FlowSettingsService,
    RoleService,
    UserService,
    TokenServices,
  } = service;
  const migrateStartTimeStamp = new Date();

  log.info("Migration database started");
  log.info("Fetching current database contents...");

  try {
    const auditLogs = (await AuditLogsService.fetchAuditLogs(true)).logs;
    const flowSettings = await FlowSettingsService.fetchAllFlowSettings();
    const roles = await RoleService.getAllRoles();
    const users = (await UserService.getUserInfos()).user;
    const tokens = await TokenServices.getAllTokens();

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

    const {
      AuditLogsService: MigrationAuditLogsService,
      FlowSettingsService: MigrationFlowSettingsService,
      RoleService: MigrationRoleService,
      UserService: MigrationUserService,
      TokenServices: MigrationTokenServices,
    } = new Service("_migrationDB");

    const auditLogMigration = () =>
      new TPromise<unknown[], void, any>(async (resolve, reject) => {
        try {
          for await (const auditLog of auditLogs) {
            const migrateAuditLog = _.has(auditLog, "_doc")
              ? {
                  ...(<{ _doc: AuditLogSchemaStruct }>(<unknown>auditLog))._doc,
                }
              : auditLog;
            delete migrateAuditLog._id;
            migrateAuditLog.timeSpan = new Date(
              migrateAuditLog.timeSpan as unknown as string
            );
            await MigrationAuditLogsService.addLog(migrateAuditLog);
          }
          await MigrationAuditLogsService.addLog({
            message: "System Database Migrated successfully",
            type: "Info",
            userID,
          });
          log.info("Audit log are Migrated successfully");
          resolve();
        } catch (error) {
          reject(error);
        }
      });

    const flowSettingsMigration = () =>
      new TPromise<unknown[], void, any>(async (resolve, reject) => {
        try {
          for await (const flowSetting of flowSettings) {
            const migrateFlowSetting = _.has(flowSetting, "_doc") ? { ...(<
                    {
                      _doc: Partial<FlowEditorSettingsConfigurations> & {
                        _id?: string | undefined;
                        username?: string | undefined;
                      };
                    }
                  >flowSetting)._doc } : flowSetting;
            const userID = migrateFlowSetting.username;
            delete migrateFlowSetting.username;
            delete migrateFlowSetting._id;

            const a = await MigrationFlowSettingsService.updateFlowSettings(
              userID!,
              migrateFlowSetting
            );
          }
          log.info("Flow Settings are Migrated successfully");
          resolve();
        } catch (error) {
          reject(error);
        }
      });

    const rolesUserMigrations = () =>
      new TPromise<unknown[], void, any>(async (resolve, reject) => {
        try {
          const newRoleIDs: { [key: string]: string } = Object.create({});
          for await (const role of roles) {
            const migrateRole = _.has(role, "_doc")
              ? { ...(<{ _doc: Role }>(<unknown>role))._doc }
              : role;

            const oldRoleID = migrateRole._id!;
            delete migrateRole._id;
            migrateRole.permissions = _.isString(migrateRole.permissions)
              ? JSON.parse(migrateRole.permissions)
              : migrateRole.permissions;

            const migratedRole = await MigrationRoleService.migrateRole(
              migrateRole
            );

            newRoleIDs[oldRoleID] = Array.isArray(migratedRole)
              ? migratedRole
              : migratedRole;
          }
          log.info("Roles are Migrated successfully");

          if (users)
            for await (const user of users) {
              const migrateUser = _.has(user, "_doc") ? { ...(<
                      {
                        _doc: userTableCollection;
                      }
                    >user)._doc } : user;

              delete migrateUser._id;

              migrateUser.roles = migrateUser.roles?.map(
                (role) => newRoleIDs[role]
              );

              await MigrationUserService.migrateUsers(migrateUser);
            }

          log.info("Users are Migrated successfully");
          resolve();
        } catch (error) {
          reject(error);
        }
      });

    const tokensMigration = () =>
      new TPromise<unknown[], void, any>(async (resolve, reject) => {
        try {
          for await (const token of tokens) {
            const migrateToken = _.has(token, "_doc")
              ? { ...(<{ _doc: Tokens }>(<unknown>token))._doc }
              : token;
            delete migrateToken._id;
            migrateToken.created_at = new Date(migrateToken.created_at);
            migrateToken.updated_at = new Date(migrateToken.updated_at);
            migrateToken.expires_at = new Date(migrateToken.expires_at);

            await MigrationTokenServices.migrateToken(migrateToken);
          }
          log.info("Tokens are Migrated successfully");
          resolve();
        } catch (error) {
          reject(error);
        }
      });

    await Promise.all([
      auditLogMigration(),
      flowSettingsMigration(),
      rolesUserMigrations(),
      tokensMigration(),
    ]).catch((error) => {
      console.log(error);

      throw error;
    });

    log.info(
      "Migrations successfully with data at timestamp " +
        `${migrateStartTimeStamp.toLocaleTimeString()} ${migrateStartTimeStamp.toLocaleDateString()}`
    );
  } catch (error) {
    console.log(error);
  }
}

export default systemDatabaseMigration;
