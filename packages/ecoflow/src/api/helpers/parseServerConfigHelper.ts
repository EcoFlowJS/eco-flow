import { configOptions } from "@ecoflow/types";
import systemDatabaseConfigurations from "./systemDatabaseConfigurations.js";
import serverConfigurationParser from "./serverConfigurationParser.js";
import corsConfigurationParser from "./corsConfigurationParser.js";
import apiRouterConfigurations from "./apiRouterConfigurations.js";
import directoryConfigurations from "./directoryConfigurations.js";
import flowConfigurations from "./flowConfigurations.js";
import loggingConfigurations from "./loggingConfigurations.js";
import editorConfigurations from "./editorConfigurations.js";
import systemDatabaseMigration from "./systemDatabaseMigration.js";
import exportProject from "./exportProject.js";
import removeFlowDescription from "./removeFlowDescription.js";
import removeModulesPackages from "./removeModulesPackages.js";
import migrateToNew from "./migrateToNew.js";
import removeDBConnections from "./removeDBConnections.js";
import installDefaultModules from "./installDefaultModules.js";

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
      await exportProject();
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
