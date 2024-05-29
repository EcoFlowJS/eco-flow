import { configOptions } from "@ecoflow/types";
import fse from "fs-extra";
import path from "path";
import systemDatabaseConfigurations from "./systemDatabaseConfigurations";
import serverConfigurationParser from "./serverConfigurationParser";
import corsConfigurationParser from "./corsConfigurationParser";
import apiRouterConfigurations from "./apiRouterConfigurations";
import directoryConfigurations from "./directoryConfigurations";
import flowConfigurations from "./flowConfigurations";
import loggingConfigurations from "./loggingConfigurations";
import editorConfigurations from "./editorConfigurations";
import systemDatabaseMigration from "./systemDatabaseMigration";
import exportProject from "./exportProject";
import { format } from "date-and-time";
import removeFlowDescription from "./removeFlowDescription";
import removeModulesPackages from "./removeModulesPackages";
import migrateToNew from "./migrateToNew";
import removeDBConnections from "./removeDBConnections";
import installDefaultModules from "./installDefaultModules";

/**
 * Parses the server configuration based on the provided config request object.
 * @param {any} configRequest - The configuration request object.
 * @returns {Promise<configOptions>} A promise that resolves to the parsed server configuration options.
 */
const parseServerConfigHelper = async (
  configRequest: any
): Promise<configOptions> => {
  const { userID, migrate, ...restConfigRequest } = configRequest;
  const { _, config } = ecoFlow;
  const databaseConfig = config.get("database");
  const updatedDatabase = await systemDatabaseConfigurations({
    ...restConfigRequest,
  });

  if (!_.isEqual(updatedDatabase, { databaseConfig }) && migrate) {
    if (_.isBoolean(migrate) && migrate)
      await systemDatabaseMigration(updatedDatabase).migrate(userID);

    if (
      _.isObjectLike(migrate) &&
      !_.isEmpty(migrate.name) &&
      !_.isEmpty(migrate.username) &&
      !_.isEmpty(migrate.password)
    ) {
      await fse.ensureDir(path.join(config.get("userDir"), "exports"));
      await fse.writeFile(
        path.join(
          config.get("userDir"),
          "exports",
          `export_${format(new Date(), "DD-MM-YYYY")}_${format(
            new Date(),
            "HH-mm-ss"
          )}.zip`
        ),
        await exportProject()
      );
      await removeFlowDescription();
      await removeModulesPackages();
      await removeDBConnections();
      await migrateToNew(updatedDatabase.database!, migrate);
      await installDefaultModules();
    }
  }

  return {
    ...(await serverConfigurationParser({ ...restConfigRequest })),
    ...(await corsConfigurationParser({ ...restConfigRequest })),
    ...(await apiRouterConfigurations({ ...restConfigRequest })),
    ...(await directoryConfigurations({ ...restConfigRequest })),
    ...(await flowConfigurations({ ...restConfigRequest })),
    ...(await loggingConfigurations({ ...restConfigRequest })),
    ...(await editorConfigurations({ ...restConfigRequest })),
    ...updatedDatabase,
  };
};

export default parseServerConfigHelper;
