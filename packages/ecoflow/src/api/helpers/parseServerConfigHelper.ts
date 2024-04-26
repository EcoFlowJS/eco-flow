import { configOptions } from "@ecoflow/types";
import systemDatabaseConfigutations from "./systemDatabaseConfigutations";
import serverConfigurationParser from "./serverConfigurationParser";
import corsConfigurationParser from "./corsConfigurationParser";
import ecoFlowRouterConfigutations from "./ecoFlowRouterConfigutations";
import apiRouterConfigutations from "./apiRouterConfigutations";
import directoryConfigutations from "./directoryConfigutations";
import flowConfigutations from "./flowConfigutations";
import loggingConfigutations from "./loggingConfigutations";
import editorConfigutations from "./editorConfigutations";
import systemDatabaseMigration from "./systemDatabaseMigration";

const parseServerConfigHelper = async (
  configRequest: any
): Promise<configOptions> => {
  const { userID, ...restConfigRequest } = configRequest;
  const { _, config } = ecoFlow;
  const database = config._config.database;
  const updatedDatabase = await systemDatabaseConfigutations({
    ...restConfigRequest,
  });

  if (!_.isEqual(updatedDatabase, { database }))
    await systemDatabaseMigration(updatedDatabase).migrate(userID);

  return {
    ...(await serverConfigurationParser({ ...restConfigRequest })),
    ...(await corsConfigurationParser({ ...restConfigRequest })),
    ...(await ecoFlowRouterConfigutations({ ...restConfigRequest })),
    ...(await apiRouterConfigutations({ ...restConfigRequest })),
    ...(await directoryConfigutations({ ...restConfigRequest })),
    ...(await flowConfigutations({ ...restConfigRequest })),
    ...(await loggingConfigutations({ ...restConfigRequest })),
    ...(await editorConfigutations({ ...restConfigRequest })),
    ...updatedDatabase,
  };
};

export default parseServerConfigHelper;
