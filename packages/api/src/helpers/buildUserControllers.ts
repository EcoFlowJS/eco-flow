import {
  EcoContext,
  ModuleTypes,
  NodeConfiguration,
  Nodes,
  UserControllers,
} from "@ecoflow/types";

const buildUserControllers = async (
  middlewares: Nodes,
  configurations: NodeConfiguration[]
): Promise<
  [
    string,
    ModuleTypes,
    NodeConfiguration["configs"] | undefined,
    () => Promise<UserControllers>
  ][]
> => {
  const { _, ecoModule } = ecoFlow;
  const result: [
    string,
    ModuleTypes,
    NodeConfiguration["configs"] | undefined,
    () => Promise<UserControllers>
  ][] = [];
  for await (const middleware of middlewares) {
    const { type, controller } = await ecoModule.getNodes(
      middleware.data.moduleID._id
    )!;
    if (type === "Request") continue;

    const inputs = configurations.find(
      (configuration) => configuration.nodeID === middleware.id
    )?.configs;

    const nodeController: () => Promise<void> = _.isString(controller)
      ? await ecoModule
          .getModuleSchema(controller.split(".")[0])
          .getController(controller.split(".")[1])
      : controller ||
        function (this: EcoContext) {
          this.next();
        };
    const modduleType: ModuleTypes =
      middleware.type === "Request"
        ? "Request"
        : middleware.type === "Middleware"
        ? "Middleware"
        : middleware.type === "Debug"
        ? "Debug"
        : middleware.type === "Response"
        ? "Response"
        : "Request";

    result.push([middleware.id, modduleType, inputs, nodeController]);
  }

  return result;
};

export default buildUserControllers;
