import { PackageManager, removeDependency, detectPackageManager } from "nypm";
import path from "path";
import fse from "fs-extra";

/**
 * Asynchronously removes the specified package or packages from the project.
 * @param {string | string[]} packageNames - The name of the package(s) to be removed.
 * @param {string} cwd - The current working directory of the project.
 * @param {PackageManager | undefined} packageManager - The package manager to use for removal.
 * @returns None
 */
const removePackageProcessor = async (
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
        await removePackageProcessor(packageName, cwd, packageManager)
    );

  if (typeof packageNames === "string")
    await removeDependency(packageNames, {
      cwd: cwd,
      packageManager: packageManager,
    });
};

/**
 * Removes the specified package or packages from the given package directory.
 * @param {string} packageDir - The directory where the package is located.
 * @param {string | string[]} packageNames - The name or names of the package(s) to be removed.
 * @returns None
 */
const removePackage = async (
  packageDir: string,
  packageNames: string | string[]
) => {
  await fse.ensureDir(packageDir);
  await fse.ensureFile(path.join(packageDir, "package-lock.json"));
  let packageManager = await detectPackageManager(packageDir);
  await removePackageProcessor(packageNames, packageDir, packageManager);
};

export default removePackage;
