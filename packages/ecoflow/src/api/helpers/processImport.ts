import { SetupImportStatus, configOptions } from "@ecoflow/types";
import path from "path";
import fse from "fs-extra";
import AdmZip from "adm-zip";
import processImportEnvs from "./processImportEnvs.js";
import processImportConfigs from "./processImportConfigs.js";
import processImportUsers from "./processImportUsers.js";
import processImportPackages from "./processImportPackages.js";
import processImportDatabase from "./processImportDatabase.js";
import processImportFlow from "./processImportFlow.js";

const processImport = async (file: string): Promise<boolean> => {
  const { _, config, database, server } = ecoFlow;
  const fileName = path.basename(file).replace(/\.[^/.]+$/, "");
  const importStatus: SetupImportStatus = {
    envs: "init",
    config: "init",
    users: "init",
    packages: "init",
    databases: "init",
    flowSchematic: "init",
  };

  server.systemSocket.emit("importFileSetup", importStatus);

  const extractDirectory = path.join(config.get("userDir"), "temp", fileName);
  await fse.ensureDir(extractDirectory);
  new AdmZip(file).extractAllTo(extractDirectory);
  await fse.remove(file);

  const [statusEnvs, messageEnvs] = await processImportEnvs(extractDirectory);
  if (!statusEnvs) {
    server.systemSocket.emit("importFileSetup", <SetupImportStatus>{
      ...importStatus,
      envs: "error",
      config: "error",
      users: "error",
      packages: "error",
      databases: "error",
      flowSchematic: "error",
    });
    fse.remove(extractDirectory);
    throw messageEnvs;
  }
  importStatus.envs = "success";
  server.systemSocket.emit("importFileSetup", importStatus);

  const [statusConfigs, messageConfigs] = await processImportConfigs(
    extractDirectory
  );
  if (!statusConfigs) {
    server.systemSocket.emit("importFileSetup", <SetupImportStatus>{
      ...importStatus,
      config: "error",
      users: "error",
      packages: "error",
      databases: "error",
      flowSchematic: "error",
    });
    fse.remove(extractDirectory);
    throw messageConfigs;
  }
  importStatus.config = "success";
  server.systemSocket.emit("importFileSetup", importStatus);

  const [statusUsers, messageUsers] = await processImportUsers(
    extractDirectory
  );
  if (!statusUsers) {
    server.systemSocket.emit("importFileSetup", <SetupImportStatus>{
      ...importStatus,
      users: "error",
      packages: "error",
      databases: "error",
      flowSchematic: "error",
    });
    fse.remove(extractDirectory);
    throw messageUsers;
  }
  importStatus.users = "success";
  server.systemSocket.emit("importFileSetup", importStatus);

  const [statusPackages, messagePackages] = await processImportPackages(
    extractDirectory
  );
  if (!statusPackages) {
    server.systemSocket.emit("importFileSetup", <SetupImportStatus>{
      ...importStatus,
      packages: "error",
      databases: "error",
      flowSchematic: "error",
    });
    fse.remove(extractDirectory);
    throw messagePackages;
  }
  importStatus.packages = "success";
  server.systemSocket.emit("importFileSetup", importStatus);

  const [statusDatabase, messageDatabase] = await processImportDatabase(
    extractDirectory
  );
  if (!statusDatabase) {
    server.systemSocket.emit("importFileSetup", <SetupImportStatus>{
      ...importStatus,
      databases: "error",
      flowSchematic: "error",
    });
    fse.remove(extractDirectory);
    throw messageDatabase;
  }
  importStatus.databases = "success";
  server.systemSocket.emit("importFileSetup", importStatus);

  const [statusFlow, messageFlow] = await processImportFlow(extractDirectory);
  if (!statusFlow) {
    server.systemSocket.emit("importFileSetup", <SetupImportStatus>{
      ...importStatus,
      flowSchematic: "error",
    });
    fse.remove(extractDirectory);
    throw messageFlow;
  }
  importStatus.flowSchematic = "success";
  server.systemSocket.emit("importFileSetup", importStatus);

  await fse.remove(extractDirectory);
  return (
    Object.values(importStatus).filter((status) => status === "error")
      .length === 0
  );
};

export default processImport;
