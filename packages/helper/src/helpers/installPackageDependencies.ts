import fse from "fs-extra";
import path from "path";
import { detectPackageManager, installDependencies } from "nypm";

const installPackageDependencies = async (
  installDir: string
): Promise<void> => {
  await fse.ensureDir(installDir);
  await fse.ensureFile(path.join(installDir, "package-lock.json"));
  const packageManager = await detectPackageManager(installDir);
  await installDependencies({ cwd: installDir, packageManager });
};

export default installPackageDependencies;
