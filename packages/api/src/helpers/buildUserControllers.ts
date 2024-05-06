import EcoModule from "@ecoflow/module";
import {
  EcoContext,
  FlowsNodeDataTypes,
  ModuleTypes,
  NodeConfiguration,
  Nodes,
  UserControllers,
} from "@ecoflow/types";

/**
 * Builds user controllers based on the provided middlewares and configurations.
 * @param {Nodes} middlewares - The list of middleware nodes.
 * @param {NodeConfiguration[]} configurations - The configurations for the nodes.
 * @returns A Promise that resolves to an array of tuples containing information about the user controllers.
 */
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

  /**
   * Iterates over an array of middlewares asynchronously, processes each middleware,
   * and pushes the result into a new array.
   * @param {Array} middlewares - An array of middleware objects to iterate over.
   * @returns {Array} An array containing processed data for each middleware.
   */
  for await (const middleware of middlewares) {
    const { type, controller } = (await ecoModule.getNodes(
      middleware.data.moduleID._id
    ))!;

    /**
     * Check if the type is "Request" and continue to the next iteration if true.
     * @param {string} type - The type to check against "Request".
     * @returns None
     */
    if (type === "Request") continue;

    /**
     * Find the configurations for a specific node ID in the configurations array.
     * @param {Array} configurations - An array of configurations to search through.
     * @param {string} middleware.id - The node ID to match against in the configurations.
     * @returns The configurations for the specified node ID, or undefined if not found.
     */
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

    /**
     * Debug controller function that emits a debug event to the server system socket.
     * @this {EcoContext} - The context in which the function is called.
     * @returns None
     */
    const debugController: () => void = function (this: EcoContext) {
      const { server } = ecoFlow;
      server.systemSocket.emit("DebugWebConsole", [
        this.moduleDatas?.label,
        this.debugPayload,
      ]);
    };

    /**
     * Represents a user controller function that belongs to an EcoContext.
     * This function calls the 'next' method of the EcoContext.
     * @this {EcoContext} - The context to which this function belongs.
     * @returns {void}
     */
    const userController: () => void = function (this: EcoContext) {
      this.next();
    };

    /**
     * Retrieves the appropriate node controller based on the provided controller name and module type.
     * @returns A Promise that resolves to void, representing the node controller function.
     */
    const nodeController: () => Promise<void> = controller
      ? (await ecoModule
          .getModuleSchema(new EcoModule.IDBuilders(controller.split(".")[0]))
          .getController(controller.split(".")[1])) ||
        (modduleType === "Debug" ? debugController : userController)
      : modduleType === "Debug"
      ? debugController
      : userController;

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
