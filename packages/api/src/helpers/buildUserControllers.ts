import EcoModule from "@ecoflow/module";
import {
  EcoContext,
  FlowsNodeDataTypes,
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
    FlowsNodeDataTypes,
    NodeConfiguration["configs"] | undefined,
    () => Promise<UserControllers>
  ][]
> => {
  const { _, ecoModule } = ecoFlow;
  const result: [
    string,
    ModuleTypes,
    FlowsNodeDataTypes,
    NodeConfiguration["configs"] | undefined,
    () => Promise<UserControllers>
  ][] = [];
  for await (const middleware of middlewares) {
    const { type, controller } = (await ecoModule.getNodes(
      middleware.data.moduleID._id
    ))!;
    if (type === "Request") continue;

    const inputs = configurations.find(
      (configuration) => configuration.nodeID === middleware.id
    )?.configs;

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

    const debugController: () => void = function (this: EcoContext) {
      const { server } = ecoFlow;
      server.systemSocket.emit("DebugWebConsole", [
        this.moduleDatas?.label,
        this.debugPayload,
      ]);
    };

    const userController: () => void = function (this: EcoContext) {
      this.next();
    };

    const nodeController: () => Promise<void> = _.isString(controller)
      ? await ecoModule
          .getModuleSchema(new EcoModule.IDBuilders(controller.split(".")[0]))
          .getController(controller.split(".")[1])
      : controller ||
        (modduleType === "Debug" ? debugController : userController);
    result.push([
      middleware.id,
      modduleType,
      middleware.data,
      inputs,
      nodeController,
    ]);
  }

  return result;
};

export default buildUserControllers;
