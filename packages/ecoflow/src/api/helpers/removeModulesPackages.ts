const removeModulesPackages = async (): Promise<void> => {
  const { ecoModule } = ecoFlow;
  for await (const module of await ecoModule.installedModules) {
    await ecoModule.removeModule(module);
  }
};

export default removeModulesPackages;
