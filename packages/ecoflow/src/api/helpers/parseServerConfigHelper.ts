import { configOptions } from "@ecoflow/types";
import systemDatabaseConfigurations from "./systemDatabaseConfigurations";
import serverConfigurationParser from "./serverConfigurationParser";
import corsConfigurationParser from "./corsConfigurationParser";
import ecoFlowRouterConfigurations from "./ecoFlowRouterConfigurations";
import apiRouterConfigurations from "./apiRouterConfigurations";
import directoryConfigurations from "./directoryConfigurations";
import flowConfigurations from "./flowConfigurations";
import loggingConfigurations from "./loggingConfigurations";
import editorConfigurations from "./editorConfigurations";
import systemDatabaseMigration from "./systemDatabaseMigration";

/**
 * Parses the server configuration based on the provided config request object.
 * @param {any} configRequest - The configuration request object.
 * @returns {Promise<configOptions>} A promise that resolves to the parsed server configuration options.
 */
const parseServerConfigHelper = async (
  configRequest: any
): Promise<configOptions> => {
  const { userID, ...restConfigRequest } = configRequest;
  const { _, config } = ecoFlow;
  const database = config._config.database;
  const updatedDatabase = await systemDatabaseConfigurations({
    ...restConfigRequest,
  });

  if (!_.isEqual(updatedDatabase, { database }))
    await systemDatabaseMigration(updatedDatabase).migrate(userID);

  return {
    ...(await serverConfigurationParser({ ...restConfigRequest })),
    ...(await corsConfigurationParser({ ...restConfigRequest })),
    ...(await ecoFlowRouterConfigurations({ ...restConfigRequest })),
    ...(await apiRouterConfigurations({ ...restConfigRequest })),
    ...(await directoryConfigurations({ ...restConfigRequest })),
    ...(await flowConfigurations({ ...restConfigRequest })),
    ...(await loggingConfigurations({ ...restConfigRequest })),
    ...(await editorConfigurations({ ...restConfigRequest })),
    ...updatedDatabase,
  };
};

export default parseServerConfigHelper;
