import path from "path";
import fse from "fs-extra";

const fetchBackupFiles = async (): Promise<string[]> => {
  const { config } = ecoFlow;
  await fse.ensureDir(path.join(config.get("userDir"), "backups"));
  return (
    (
      await fse.readdir(
        path.join(path.join(config.get("userDir"), "backups")),
        {
          withFileTypes: true,
        }
      )
    )
      .filter((file) => file.isFile())
      .filter((file) => file.name.split(".").pop() === "zip")
      .map((dirent) => dirent.name.replace(/\.[^/.]+$/, "")) || []
  );
};

export default fetchBackupFiles;
