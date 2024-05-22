import path from "path";
import fse from "fs-extra";
import Helper from "@ecoflow/helper";

const processImportDatabase = async (
  extractDirectory: string
): Promise<[boolean, string]> => {
  const { _, log, database } = ecoFlow;
  try {
    if (
      (await fse.exists(path.join(extractDirectory, "DBConfigs.json"))) &&
      (await fse.lstat(path.join(extractDirectory, "DBConfigs.json"))).isFile()
    ) {
      const config = Helper.requireUncached(
        path.join(extractDirectory, "DBConfigs.json")
      );

      for await (const connections of database.connectionList.map(
        (connection) => connection.connectionsName
      ))
        await database.removeDatabaseConnection(connections);

      for await (const dbConfig of config) {
        try {
          await database.addDatabaseConnection(
            dbConfig.name,
            dbConfig.driver,
            dbConfig.connections
          );
        } catch (error) {
          log.error(_.isObjectLike(error) ? JSON.parse(error) : error);
        }
      }
    }
    return [true, "Database connection imported successfully"];
  } catch (error) {
    return [false, error];
  }
};

export default processImportDatabase;
