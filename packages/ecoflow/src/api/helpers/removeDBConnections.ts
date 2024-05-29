import fse from "fs-extra";
import path from "path";

const removeDBConnections = async (): Promise<void> => {
  const { config } = ecoFlow;
  await fse.ensureDir(path.join(config.get("DB_Directory"), "configs"));
  await fse.ensureFile(
    path.join(config.get("DB_Directory"), "configs", "connectionsConfig.json")
  );
  await fse.writeFile(
    path.join(config.get("DB_Directory"), "configs", "connectionsConfig.json"),
    "[]",
    "utf8"
  );
};

export default removeDBConnections;
