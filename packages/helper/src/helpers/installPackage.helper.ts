import fse from "fs-extra";
import { detectPackageManager, addDependency, PackageManager } from "nypm";
import path from "path";

export default async (
  installDir: string,
  packageNames: string | string[]
): Promise<void> => {
  await fse.ensureDir(installDir);
  await fse.ensureFile(path.join(installDir, "package-lock.json"));
  let packageManager = await detectPackageManager(installDir);

  await addPackages(packageNames, installDir, packageManager);
};

const addPackages = async (
  packageNames: string | string[],
  cwd: string,
  packageManager: PackageManager | undefined
) => {
  if (typeof packageManager === "undefined") return;
  if (typeof cwd === "undefined") return;
  if (typeof packageNames === "undefined") return;

  if (Array.isArray(packageNames))
    await packageNames.forEach(
      async (packageName) => await addPackages(packageName, cwd, packageManager)
    );

  if (typeof packageNames === "string")
    await addDependency(packageNames, {
      cwd: cwd,
      packageManager: packageManager,
    });
};
