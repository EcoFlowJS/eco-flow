import defaultModules from "../../defaults/defaultModules.js";

const installDefaultModules = async (): Promise<void> => {
  const { ecoModule } = ecoFlow;
  for await (const module of defaultModules)
    await ecoModule.installModule(module);
};

export default installDefaultModules;
