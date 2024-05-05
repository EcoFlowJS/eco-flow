import fse from "fs-extra";
import { detectPackageManager, addDependency, PackageManager } from "nypm";
import path from "path";

/**
 * Asynchronously adds packages to a project using the specified package manager.
 * @param {string | string[]} packageNames - The name or array of names of the packages to add.
 * @param {string} cwd - The current working directory of the project.
 * @param {PackageManager | undefined} packageManager - The package manager to use for adding packages.
 * @returns None
 */
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

/**
 * Installs the specified package or packages in the given directory using the detected package manager.
 * @param {string} installDir - The directory where the packages will be installed.
 * @param {string | string[]} packageNames - The name or names of the packages to install.
 * @returns {Promise<void>} A promise that resolves when the packages are successfully installed.
 */
const installPackage = async (
  installDir: string,
  packageNames: string | string[]
): Promise<void> => {
  await fse.ensureDir(installDir);
  await fse.ensureFile(path.join(installDir, "package-lock.json"));
  const packageManager = await detectPackageManager(installDir);

  await addPackages(packageNames, installDir, packageManager);
};

export default installPackage;
