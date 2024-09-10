import EcoModule from "@ecoflow/module";

const generateConfigNode = async (
  controller?: string
): Promise<
  [string | null, (inputs: { [key: string]: any }) => Promise<any>]
> => {
  const { _, ecoModule } = ecoFlow;

  if (_.isUndefined(controller) || !_.isString(controller))
    return [null, async () => {}];

  const moduleSchema = ecoModule.getModuleSchema(
    new EcoModule.IDBuilders(controller.split(".")[0])
  );

  return [
    moduleSchema.module?.packageName || null,
    moduleSchema.getController(controller.split(".")[1]),
  ];
};

export default generateConfigNode;
