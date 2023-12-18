import { PackageManager, removeDependency, detectPackageManager } from "nypm";
import path from "path";
import fse from "fs-extra";

export default async (packageDir: string, packageNames: string | string[]) => {
  await fse.ensureDir(packageDir);
  await fse.ensureFile(path.join(packageDir, "package-lock.json"));
  let packageManager = await detectPackageManager(packageDir);
  await removePackage(packageNames, packageDir, packageManager);
};
const removePackage = async (
  packageNames: string | string[],
  cwd: string,
  packageManager: PackageManager | undefined
) => {
  if (typeof packageManager === "undefined") return;
  if (typeof cwd === "undefined") return;
  if (typeof packageNames === "undefined") return;

  if (Array.isArray(packageNames))
    await packageNames.forEach(
      async (packageName) =>
        await removePackage(packageName, cwd, packageManager)
    );

  if (typeof packageNames === "string")
    await removeDependency(packageNames, {
      cwd: cwd,
      packageManager: packageManager,
    });
};
