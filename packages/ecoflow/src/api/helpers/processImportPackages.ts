import path from "path";
import fse from "fs-extra";
import defaultModules from "../../defaults/defaultModules";

const processImportPackages = async (
  extractDirectory: string
): Promise<[boolean, string]> => {
  const { _, config, ecoModule } = ecoFlow;

  if (
    (await fse.exists(path.join(extractDirectory, "packages"))) &&
    (await fse.lstat(path.join(extractDirectory, "packages"))).isDirectory()
  )
    await fse.copy(
      path.join(extractDirectory, "packages"),
      path.join(config.get("moduleDir"), "local")
    );

  if (
    (await fse.exists(path.join(extractDirectory, "package.json"))) &&
    (await fse.lstat(path.join(extractDirectory, "package.json"))).isFile()
  ) {
    await fse.copy(
      path.join(extractDirectory, "package.json"),
      path.join(config.get("moduleDir"), "package.json")
    );
    await ecoModule.installModules();
    await ecoModule.registerModules();
    return [true, "Packages installed successfully"];
  }

  for await (const module of defaultModules)
    await ecoModule.installModule(module);
  await ecoModule.registerModules();

  return [true, "Packages installed successfully"];
};

export default processImportPackages;
