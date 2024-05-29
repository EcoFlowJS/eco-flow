import path from "path";
import fse from "fs-extra";
import { format } from "date-and-time";

const exportTemplate = async (): Promise<Buffer> => {
  const { ecoModule, flowEditor, config } = ecoFlow;

  const flowDescription = await flowEditor.flowsDescription();
  const packages: string[] = [];

  for await (const ecoPackage of await ecoModule.installedModules) {
    const packageDescription = await ecoModule.getInstalledPackagesDescription(
      ecoPackage
    );
    if (!packageDescription.isLocalPackage)
      packages.push(
        `${packageDescription.name}@${packageDescription.currentVersion}`
      );
  }

  const template = JSON.stringify(
    {
      flowDescription,
      packages,
    },
    null,
    2
  );

  await fse.emptyDir(path.join(config.get("userDir"), "exports"));
  await fse.writeFile(
    path.join(
      config.get("userDir"),
      "exports",
      `export_${format(new Date(), "DD-MM-YYYY")}_${format(
        new Date(),
        "HH-mm-ss"
      )}.json`
    ),
    template,
    "utf8"
  );

  return Buffer.from(template, "utf8");
};

export default exportTemplate;
