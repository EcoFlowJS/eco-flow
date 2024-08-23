import EcoModule from "@ecoflow/module";
import { Node, NodeConfiguration } from "@ecoflow/types";

const generateConfigNode = async (
  controller?: string
): Promise<(inputs: { [key: string]: any }) => Promise<void>> => {
  const { _, ecoModule } = ecoFlow;

  if (_.isUndefined(controller) || !_.isString(controller))
    return async () => {};

  return ecoModule
    .getModuleSchema(new EcoModule.IDBuilders(controller.split(".")[0]))
    .getController(controller.split(".")[1]);
};

export default generateConfigNode;
