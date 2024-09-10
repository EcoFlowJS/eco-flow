import path from "path";
import AdmZip from "adm-zip";
import fse from "fs-extra";
import Helper from "@ecoflow/helper";
import { Builder } from "@ecoflow/utils/builder";

const restoreBackupHelper = async (zip: AdmZip): Promise<void> => {
  const { _, log, config, ecoModule, database, flowEditor } = ecoFlow;
  const tempRestoreFileDir = path.join(
    config.get("userDir"),
    "temp",
    new Date().toLocaleDateString().replace(/\//g, "-") +
      "_" +
      new Date().toLocaleTimeString().replace(/\:/g, "-").replace(/\ /g, "-")
  );

  await fse.ensureDir(tempRestoreFileDir);

  zip.extractAllTo(tempRestoreFileDir, true);

  try {
    if (
      (await fse.exists(path.join(tempRestoreFileDir, "DBConfigs.json"))) &&
      (
        await fse.lstat(path.join(tempRestoreFileDir, "DBConfigs.json"))
      ).isFile()
    ) {
      const config = Helper.requireUncached(
        path.join(tempRestoreFileDir, "DBConfigs.json")
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

    if (
      (await fse.exists(path.join(tempRestoreFileDir, "envs.json"))) &&
      (await fse.lstat(path.join(tempRestoreFileDir, "envs.json"))).isFile()
    )
      Builder.ENV.setUserEnv(
        config.get("envDir"),
        Helper.requireUncached(path.join(tempRestoreFileDir, "envs.json")),
        true
      );

    if (
      (await fse.exists(path.join(tempRestoreFileDir, "packages"))) &&
      (await fse.lstat(path.join(tempRestoreFileDir, "packages"))).isDirectory()
    )
      await fse.copy(
        path.join(tempRestoreFileDir, "packages"),
        path.join(config.get("moduleDir"), "local")
      );

    if (
      (await fse.exists(path.join(tempRestoreFileDir, "package.json"))) &&
      (await fse.lstat(path.join(tempRestoreFileDir, "package.json"))).isFile()
    ) {
      await fse.copy(
        path.join(tempRestoreFileDir, "package.json"),
        path.join(config.get("moduleDir"), "package.json")
      );
      await ecoModule.installModules();
      await ecoModule.registerModules();
    }

    if (
      (await fse.exists(path.join(tempRestoreFileDir, "flows.json"))) &&
      (await fse.lstat(path.join(tempRestoreFileDir, "flows.json"))).isFile()
    )
      flowEditor.deploy(
        Helper.requireUncached(path.join(tempRestoreFileDir, "flows.json"))
      );

    if (
      (await fse.exists(path.join(tempRestoreFileDir, "configs.json"))) &&
      (await fse.lstat(path.join(tempRestoreFileDir, "configs.json"))).isFile()
    )
      config.setConfig(
        Helper.requireUncached(path.join(tempRestoreFileDir, "configs.json"))
      );

    await fse.remove(tempRestoreFileDir);
  } catch (error) {
    throw error;
  }
};

export default restoreBackupHelper;
