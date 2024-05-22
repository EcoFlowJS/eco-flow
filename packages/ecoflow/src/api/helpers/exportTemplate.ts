const exportTemplate = async (): Promise<Buffer> => {
  const { ecoModule, flowEditor } = ecoFlow;

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

  return Buffer.from(template, "utf8");
};

export default exportTemplate;
