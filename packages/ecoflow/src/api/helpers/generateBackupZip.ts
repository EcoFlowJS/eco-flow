import {
  DatabaseConnectionConfig,
  Environment,
  FlowsDescription,
  configOptions,
} from "@ecoflow/types";
import { Builder } from "@ecoflow/utils";
import AdmZip from "adm-zip";
import fse from "fs-extra";
import path from "path";
import Helper from "@ecoflow/helper";
import { format } from "date-and-time";

const generateBackupZip = async (
  databaseConfigs: string[] | boolean,
  environmentConfigs: boolean,
  flowConfigs: boolean,
  installedPackages: string[] | boolean,
  serverConfigs: boolean
): Promise<Buffer> => {
  const { _, config, database, flowEditor, ecoModule } = ecoFlow;
  const backupZip = new AdmZip();

  const DBConfigs: DatabaseConnectionConfig[] = [];
  const envs: Environment[] = [];
  const flows: FlowsDescription = {};
  const ecoPackages: { dependencies: { [key: string]: string } } = {
    dependencies: {},
  };
  let configs: configOptions = {};

  if (_.isBoolean(databaseConfigs) && databaseConfigs)
    DBConfigs.push(...(await database.getDatabaseConfig()));
  if (_.isArray(databaseConfigs) && databaseConfigs.length > 0)
    for await (const DBConnectionNames of databaseConfigs)
      DBConfigs.push(...(await database.getDatabaseConfig(DBConnectionNames)));

  if (_.isBoolean(environmentConfigs) && environmentConfigs) {
    const userEnvs = Builder.ENV.getUserEnv();
    _.isArray(userEnvs) ? envs.push(...userEnvs) : envs.push(userEnvs);
  }

  if (_.isBoolean(flowConfigs) && flowConfigs) {
    const flowsDescription = await flowEditor.flowsDescription();
    Object.keys(flowsDescription).forEach(
      (flowName) => (flows[flowName] = flowsDescription[flowName])
    );
  }

  const packagesNames: string[] = [];
  if (_.isBoolean(installedPackages) && installedPackages)
    packagesNames.push(...(await ecoModule.installedModules));
  if (_.isArray(installedPackages) && installedPackages.length > 0)
    packagesNames.push(...installedPackages);

  const moduleDir = config.get("moduleDir");
  if (packagesNames.length > 0) {
    if (await fse.exists(path.join(moduleDir, "local")))
      backupZip.addLocalFolder(path.join(moduleDir, "local"), "packages");

    const currentPackages = Helper.requireUncached(
      path.join(moduleDir, "package.json")
    ).dependencies;
    const { dependencies: backupPackages } = ecoPackages;
    packagesNames.forEach(
      (packageName) =>
        (backupPackages[packageName] = currentPackages[packageName])
    );
  }

  if (_.isBoolean(serverConfigs) && serverConfigs) configs = config._config;

  if (!_.isEmpty(DBConfigs))
    backupZip.addFile(
      "DBConfigs.json",
      Buffer.from(JSON.stringify(DBConfigs, null, 2), "utf8")
    );

  if (!_.isEmpty(envs))
    backupZip.addFile(
      "envs.json",
      Buffer.from(JSON.stringify(envs, null, 2), "utf8")
    );

  if (!_.isEmpty(flows))
    backupZip.addFile(
      "flows.json",
      Buffer.from(JSON.stringify(flows, null, 2), "utf8")
    );

  if (!_.isEmpty(ecoPackages.dependencies))
    backupZip.addFile(
      "package.json",
      Buffer.from(JSON.stringify(ecoPackages, null, 2), "utf8")
    );

  if (!_.isEmpty(configs))
    backupZip.addFile(
      "configs.json",
      Buffer.from(JSON.stringify(configs, null, 2), "utf8")
    );

  backupZip.writeZip(
    path.join(
      config.get("userDir"),
      "backups",
      `backup_${format(new Date(), "DD-MM-YYYY")}_${format(
        new Date(),
        "HH-mm-ss"
      )}.zip`
    )
  );
  return backupZip.toBuffer();
};

export default generateBackupZip;
