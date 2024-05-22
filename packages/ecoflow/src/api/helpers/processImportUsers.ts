import path from "path";
import fse from "fs-extra";
import {
  AuditLog,
  AuditLogSchemaStruct,
  FlowEditorSettingsConfigurations,
  Role,
  userTableCollection,
} from "@ecoflow/types";
import Helper from "@ecoflow/helper";
import prepareDBMigration from "./prepareDBMigration";
import TPromise from "thread-promises";

interface UsersConfig {
  auditLogs: ({ _id: string } & AuditLog)[];
  flowSettings: (Partial<FlowEditorSettingsConfigurations> & {
    _id?: string | undefined;
    username?: string | undefined;
  })[];
  userRoles: Role[];
  users: userTableCollection[];
}

const processImportUsers = async (
  extractDirectory: string
): Promise<[boolean, string]> => {
  const { _, config, log, service, database } = ecoFlow;
  const { AuditLogsService, FlowSettingsService, RoleService, UserService } =
    service;
  if (!(await fse.exists(path.join(extractDirectory, "systemDB.json")))) {
    fse.remove(extractDirectory);
    return [false, "Users configuration not found."];
  }

  try {
    const driver = config.get("database").driver;
    const configuration = config.get("database").configuration;
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
    log.info("Preparing database import");
    await prepareDBMigration(database.getDatabaseConnection("_migrationDB"));

    log.info("Importing database contents...");

    const { auditLogs, flowSettings, userRoles, users }: UsersConfig =
      Helper.requireUncached(path.join(extractDirectory, "systemDB.json"));

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
            await AuditLogsService.addLog(migrateAuditLog);
          }
          log.info("Audit log are imported successfully");
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

            const a = await FlowSettingsService.updateFlowSettings(
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
          for await (const role of userRoles) {
            const migrateRole = _.has(role, "_doc")
              ? { ...(<{ _doc: Role }>(<unknown>role))._doc }
              : role;

            const oldRoleID = migrateRole._id!;
            delete migrateRole._id;
            migrateRole.permissions = _.isString(migrateRole.permissions)
              ? JSON.parse(migrateRole.permissions)
              : migrateRole.permissions;

            const migratedRole = await RoleService.migrateRole(migrateRole);

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

              await UserService.migrateUsers(migrateUser);
            }

          log.info("Users are imported successfully");
          resolve();
        } catch (error) {
          reject(error);
        }
      });

    await Promise.all([
      auditLogMigration(),
      flowSettingsMigration(),
      rolesUserMigrations(),
    ]).catch((error) => {
      console.log(error);
      throw error;
    });

    return [true, "User configuration imported successfully"];
  } catch (error) {
    return [false, error];
  }
};

export default processImportUsers;
