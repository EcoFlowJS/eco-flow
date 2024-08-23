import {
  FlowConfigurations,
  FlowConnections,
  FlowDefinitions,
  FlowsDescription,
  EcoFlowEditor as IEcoFlowEditor,
  EcoFLowBuilder as IEcoFLowBuilder,
  configOptions,
  Descriptions,
  NodeConfiguration,
  Node,
  NodeConnections,
  Nodes,
  ConfigNodesStack,
} from "@ecoflow/types";
import { glob } from "glob";
import path from "path";
import fse from "fs-extra";
import { EcoFLowBuilder } from "./EcoFLowBuilder";
import { EcoAPIBuilder, EcoAPIRouterBuilder } from "@ecoflow/api";
import generateConfigNode from "../helpers/generateConfigNode";

/**
 * Represents an EcoFlowEditor class that implements IEcoFlowEditor interface.
 * This class is responsible for managing EcoFlow configurations and files.
 * @constructor
 * @param {string} [directory] - The directory path for the flow editor.
 */
export class EcoFlowEditor implements IEcoFlowEditor {
  private flowDir: string;
  private flowNodeDefinitions: string;
  private flowNodeConnections: string;
  private flowNodeConfigurations: string;
  private flowFilePretty: boolean;
  private _flowBuilder: IEcoFLowBuilder;

  /**
   * Constructs a new instance of the EcoFlow class with the given directory.
   * If no directory is provided, it uses the default directory from the EcoFlow configuration.
   * @param {string} [directory] - The directory where EcoFlow will be initialized.
   * @returns None
   */
  constructor(directory?: string) {
    const { config } = ecoFlow;
    const {
      flowDir: defaultFlowDir,
      flowNodeDefinitions: defaultFlowNodeDefinitions,
      flowNodeConnections: defaultFlowNodeConnections,
      flowNodeConfigurations: defaultFlowNodeConfigurations,
      flowFilePretty: defaultFlowFilePretty,
    } = config.getDefaultConfigs();
    const {
      flowDir,
      flowNodeDefinitions,
      flowNodeConnections,
      flowNodeConfigurations,
      flowFilePretty,
    } = config._config;

    this.flowDir = directory || flowDir || defaultFlowDir!;
    this.flowNodeDefinitions =
      flowNodeDefinitions || defaultFlowNodeDefinitions!;
    this.flowNodeConnections =
      flowNodeConnections || defaultFlowNodeConnections!;
    this.flowNodeConfigurations =
      flowNodeConfigurations || defaultFlowNodeConfigurations!;
    this.flowFilePretty = flowFilePretty || defaultFlowFilePretty!;
    this._flowBuilder = new EcoFLowBuilder();

    fse.ensureDirSync(this.flowDir, 0o2775);
  }

  /**
   * Updates the flow node definitions file by renaming it from oldName to newName.
   * @param {string} flowName - The name of the flow.
   * @param {string} oldName - The old name of the definitions file.
   * @param {string} newName - The new name of the definitions file.
   * @returns {Promise<void>} A promise that resolves once the file is successfully renamed.
   */
  private async updateFlowNodeDefinitionsFile(
    flowName: string,
    oldName: string,
    newName: string
  ): Promise<void> {
    if (
      path.join(this.flowDir, flowName, `definitions_${oldName}`) ===
      path.join(this.flowDir, flowName, `definitions_${newName}`)
    )
      return;
    await fse.move(
      path.join(this.flowDir, flowName, `definitions_${oldName}`),
      path.join(this.flowDir, flowName, `definitions_${newName}`)
    );
    this.flowNodeDefinitions = newName;
  }

  /**
   * Updates the connections file for a specific flow node by renaming it with a new name.
   * @param {string} flowName - The name of the flow containing the node.
   * @param {string} oldName - The old name of the connections file.
   * @param {string} newName - The new name to rename the connections file to.
   * @returns {Promise<void>} A promise that resolves once the connections file is successfully updated.
   */
  private async updateFlowNodeConnectionsFile(
    flowName: string,
    oldName: string,
    newName: string
  ): Promise<void> {
    if (
      path.join(this.flowDir, flowName, `connections_${oldName}`) ===
      path.join(this.flowDir, flowName, `connections_${newName}`)
    )
      return;
    await fse.move(
      path.join(this.flowDir, flowName, `connections_${oldName}`),
      path.join(this.flowDir, flowName, `connections_${newName}`)
    );
    this.flowNodeConnections = newName;
  }

  /**
   * Updates the configuration file for a specific flow node by renaming it with a new name.
   * @param {string} flowName - The name of the flow containing the node.
   * @param {string} oldName - The current name of the configuration file.
   * @param {string} newName - The new name to rename the configuration file to.
   * @returns {Promise<void>} A Promise that resolves once the file has been successfully renamed.
   */
  private async updateFlowNodeConfigurationsFile(
    flowName: string,
    oldName: string,
    newName: string
  ): Promise<void> {
    if (
      path.join(this.flowDir, flowName, `configurations_${oldName}`) ===
      path.join(this.flowDir, flowName, `configurations_${newName}`)
    )
      return;
    await fse.move(
      path.join(this.flowDir, flowName, `configurations_${oldName}`),
      path.join(this.flowDir, flowName, `configurations_${newName}`)
    );
    this.flowNodeConfigurations = newName;
  }

  /**
   * Updates the flow node definitions for a given flow name with the provided value.
   * @param {string} flowName - The name of the flow to update.
   * @param {Nodes | undefined} value - The nodes to update the flow with.
   * @returns {Promise<this>} A promise that resolves to the updated object.
   */
  private async updateFlowNodeDefinitions(
    flowName: string,
    value?: Nodes
  ): Promise<this> {
    await fse.ensureFile(
      path.join(
        this.flowDir,
        flowName,
        `definitions_${this.flowNodeDefinitions}`
      )
    );

    /**
     * Asynchronously writes data to a file, replacing the file if it already exists.
     * @param {string} path - The file path where the data will be written.
     * @param {string | Buffer} data - The data to write to the file.
     * @param {string} encoding - The encoding of the data.
     * @returns A Promise that resolves when the file is successfully written.
     */
    await fse.writeFile(
      path.join(
        this.flowDir,
        flowName,
        `definitions_${this.flowNodeDefinitions}`
      ),
      value ? JSON.stringify(value, null, this.flowFilePretty ? 2 : 0) : "{}",
      "utf8"
    );

    return this;
  }

  /**
   * Updates the connections for a specific flow node in the file system.
   * @param {string} flowName - The name of the flow to update connections for.
   * @param {NodeConnections} [value] - The new connections to set for the flow node.
   * @returns {Promise<this>} A promise that resolves with the updated instance of the class.
   */
  private async updateFlowNodeConnections(
    flowName: string,
    value?: NodeConnections
  ): Promise<this> {
    await fse.ensureFile(
      path.join(
        this.flowDir,
        flowName,
        `connections_${this.flowNodeConnections}`
      )
    );

    /**
     * Asynchronously writes data to a file, replacing the file if it already exists.
     * @param {string} path - The file path where the data will be written.
     * @param {string | Buffer} data - The data to write to the file.
     * @param {string} options - The encoding of the file (e.g., 'utf8').
     * @returns A Promise that resolves when the file is successfully written.
     */
    await fse.writeFile(
      path.join(
        this.flowDir,
        flowName,
        `connections_${this.flowNodeConnections}`
      ),
      value ? JSON.stringify(value, null, this.flowFilePretty ? 2 : 0) : "{}",
      "utf8"
    );

    return this;
  }

  /**
   * Updates the configurations for a specific flow node in the file system.
   * @param {string} flowName - The name of the flow to update configurations for.
   * @param {NodeConfiguration[]} [value] - The array of node configurations to update.
   * @returns {Promise<this>} A promise that resolves to the updated instance of the class.
   */
  private async updateFlowNodeConfigurations(
    flowName: string,
    value?: NodeConfiguration[]
  ): Promise<this> {
    await fse.ensureFile(
      path.join(
        this.flowDir,
        flowName,
        `configurations_${this.flowNodeConfigurations}`
      )
    );

    /**
     * Asynchronously writes data to a file, replacing the file if it already exists.
     * @param {string} path - The file path where the data will be written.
     * @param {string | Buffer} data - The data to write to the file.
     * @param {string} options - The encoding of the file (e.g., 'utf8').
     * @returns A Promise that resolves when the file is successfully written.
     */
    await fse.writeFile(
      path.join(
        this.flowDir,
        flowName,
        `configurations_${this.flowNodeConfigurations}`
      ),
      value ? JSON.stringify(value, null, this.flowFilePretty ? 2 : 0) : "{}",
      "utf8"
    );

    return this;
  }

  /**
   * Registers node configurations based on the provided ConfigNodesStack.
   * @param {ConfigNodesStack} configStack - The stack of node configurations to register.
   * @returns {Promise<string[]>} - A promise that resolves to an array of error node IDs.
   */
  private async registerNodeConfigurations(
    configStack: ConfigNodesStack
  ): Promise<string[]> {
    /**
     * Destructures the ecoFlow object to extract the _ and ecoModule properties.
     * Resets the moduleConfigurations property of ecoFlow to an empty object.
     * @param {Object} ecoFlow - The ecoFlow object containing _ and ecoModule properties.
     * @returns None
     */
    const { _, ecoModule } = ecoFlow;
    let { moduleConfigurations } = ecoFlow;
    moduleConfigurations = {};

    /**
     * Retrieves an array of keys from the configStack object.
     * @returns An array containing the keys of the configStack object.
     */
    const modules = Object.keys(configStack);

    /**
     * An array of string values representing error node IDs.
     */
    const errorNodeIDs: string[] = [];

    /**
     * Asynchronously iterates over modules and their nodes to generate configuration nodes.
     * @param {Array} modules - An array of modules to iterate over.
     * @returns None
     */
    for await (const module of modules) {
      const nodeInfo = await ecoModule.getNodes(module);

      /**
       * If the nodeInfo is falsy, skip the current iteration and continue to the next one.
       */
      if (!nodeInfo) continue;

      /**
       * Destructures the 'controller' property from the 'nodeInfo' object.
       * @param {Object} nodeInfo - The object containing the 'controller' property.
       * @returns The 'controller' property from the 'nodeInfo' object.
       */
      const { controller } = nodeInfo;

      /**
       * Generates a configuration node based on the provided controller.
       * @param {Controller} controller - The controller object to generate the configuration node from.
       * @returns {Promise<ConfigNode>} A promise that resolves to the generated configuration node.
       */
      const configController = await generateConfigNode(controller);

      /**
       * Asynchronously iterates over the nodes in the configStack for a specific module,
       * extracts necessary data, and calls the configController with the extracted data.
       * Any errors encountered during the process are added to the errorNodeIDs array.
       * @param {Object} configStack - The configuration stack object containing nodes and configurations.
       * @param {string} module - The module to iterate over in the configStack.
       * @param {Object} moduleConfigurations - The configurations specific to the module.
       * @param {Array} errorNodeIDs - An array to store the IDs of nodes that encountered errors.
       * @param {Function} configController - The function responsible for handling configuration data.
       * @returns None
       */
      for await (const node of configStack[module].nodes) {
        const { id, data } = node;
        const { label, moduleID } = data;
        const configs = configStack[module].configurations.find(
          (config) => config.nodeID === id
        );

        try {
          configController.call(
            {
              id,
              global: moduleConfigurations,
              label,
              moduleID,
              inputs: configs?.configs,
            } || {},
            {
              id,
              global: moduleConfigurations,
              label,
              moduleID,
              inputs: configs?.configs,
            } || {}
          );
        } catch {
          errorNodeIDs.push(id);
        }
      }
    }

    return errorNodeIDs;
  }

  /**
   * Creates a new flow with the given name.
   * @param {string} flowName - The name of the flow to create.
   * @returns {Promise<void>} A promise that resolves once the flow is created.
   * @throws {string} If the flow with the given name already exists.
   */
  async createFlow(flowName: string): Promise<void> {
    if ((await this.flows).includes(flowName)) throw "Flow already exists.";

    /**
     * Ensures that the directory specified by joining the flow directory and the flow name exists.
     * If the directory structure does not exist, it is created.
     * @returns Promise<void>
     */
    await fse.ensureDir(path.join(this.flowDir, flowName));

    /**
     * Updates the flow node definitions, connections, and configurations for a given flow.
     * @param {string} flowName - The name of the flow to update.
     * @returns A promise that resolves when all updates are complete.
     */
    await (
      await (
        await this.updateFlowNodeDefinitions(flowName)
      ).updateFlowNodeConnections(flowName)
    ).updateFlowNodeConfigurations(flowName);
  }

  /**
   * Updates the flow configurations based on the provided configs and newConfigs.
   * @param {Required<Pick<configOptions, "flowDir" | "flowFilePretty" | "flowNodeConfigurations" | "flowNodeConnections" | "flowNodeDefinitions">} configs - The current flow configurations.
   * @param {Required<Pick<configOptions, "flowNodeConfigurations" | "flowNodeConnections" | "flowNodeDefinitions">} [newConfigs] - The new flow configurations to update.
   * @returns {Promise<void>} A promise that resolves once the flow configurations are updated.
   */
  async updateFlowConfigs(
    configs: Required<
      Pick<
        configOptions,
        | "flowDir"
        | "flowFilePretty"
        | "flowNodeConfigurations"
        | "flowNodeConnections"
        | "flowNodeDefinitions"
      >
    >,
    newConfigs?: Required<
      Pick<
        configOptions,
        "flowNodeConfigurations" | "flowNodeConnections" | "flowNodeDefinitions"
      >
    >
  ): Promise<void> {
    const { log } = ecoFlow;
    /**
     * Updates flow node definitions, connections, and configurations files based on the new configurations provided.
     * @param {object} configs - The current configurations object.
     * @param {object} newConfigs - The new configurations object to update to.
     * @returns None
     * @throws {Error} If an error occurs during the update process.
     */
    try {
      if (configs.flowDir) this.flowDir = configs.flowDir;
      if (configs.flowFilePretty) this.flowFilePretty = configs.flowFilePretty;

      if (newConfigs)
        /**
         * Iterates over each flow in the flows array and updates the corresponding files if they exist.
         * @returns None
         */
        for await (const flowName of await this.flows) {
          /**
           * Checks if a specific file exists and updates the flow node definitions file if it does.
           * @param {string} flowName - The name of the flow.
           * @param {string} configs.flowNodeDefinitions - The current flow node definitions file.
           * @param {string} newConfigs.flowNodeDefinitions - The updated flow node definitions file.
           * @returns None
           */
          if (
            await fse.exists(
              path.join(
                this.flowDir,
                flowName,
                `definitions_${configs.flowNodeDefinitions}`
              )
            )
          )
            await this.updateFlowNodeDefinitionsFile(
              flowName,
              configs.flowNodeDefinitions!,
              newConfigs.flowNodeDefinitions
            );

          /**
           * Checks if a specific file exists and updates the flow node connections file if it does.
           * @param {string} flowName - The name of the flow.
           * @param {string} configs.flowNodeConnections - The configuration for flow node connections.
           * @param {string} newConfigs.flowNodeConnections - The updated configuration for flow node connections.
           * @returns None
           */
          if (
            await fse.exists(
              path.join(
                this.flowDir,
                flowName,
                `connections_${configs.flowNodeConnections}`
              )
            )
          )
            await this.updateFlowNodeConnectionsFile(
              flowName,
              configs.flowNodeConnections!,
              newConfigs.flowNodeConnections
            );

          /**
           * Checks if a specific file exists and updates the flow node configurations file if it does.
           * @param {string} flowName - The name of the flow.
           * @param {string} configs.flowNodeConfigurations - The configuration of the flow node.
           * @param {string} newConfigs.flowNodeConfigurations - The new configuration of the flow node.
           * @returns None
           */
          if (
            await fse.exists(
              path.join(
                this.flowDir,
                flowName,
                `configurations_${configs.flowNodeConfigurations}`
              )
            )
          )
            await this.updateFlowNodeConfigurationsFile(
              flowName,
              configs.flowNodeConfigurations!,
              newConfigs.flowNodeConfigurations
            );
        }
    } catch (e) {
      log.error(e);
    }
  }

  /**
   * Removes a flow with the given name.
   * @param {string} flowName - The name of the flow to be removed.
   * @returns {Promise<void>} A promise that resolves once the flow is successfully removed.
   * @throws {string} If the flow does not exist.
   */
  async removeFlow(flowName: string): Promise<void> {
    if (!(await this.flows).includes(flowName)) throw "Flow doesn't exists.";

    /**
     * Removes a directory at the specified path.
     * @param {string} path - The path to the directory to be removed.
     * @returns Promise<void>
     */
    await fse.remove(path.join(this.flowDir, flowName));
  }

  /**
   * Checks if a flow with the given name exists.
   * @param {string} flowName - The name of the flow to check.
   * @returns {Promise<boolean>} A promise that resolves to true if the flow exists, false otherwise.
   */
  async isFlow(flowName: string): Promise<boolean> {
    const filePath = path.join(this.flowDir, flowName);
    return (
      (await fse.exists(filePath)) &&
      (await fse.lstat(filePath)).isDirectory() &&
      (await fse.exists(
        path.join(filePath, `definitions_${this.flowNodeDefinitions}`)
      )) &&
      (await fse.exists(
        path.join(filePath, `connections_${this.flowNodeConnections}`)
      )) &&
      (await fse.exists(
        path.join(filePath, `configurations_${this.flowNodeConfigurations}`)
      ))
    );
  }

  /**
   * Asynchronously retrieves the flow definitions for a given flow name or for all flows.
   * @param {string} [flowName] - The name of the flow to retrieve definitions for.
   * @returns {Promise<FlowDefinitions>} A promise that resolves to an object containing the flow definitions.
   */
  async getFlowDefinitions(flowName?: string): Promise<FlowDefinitions> {
    const { _ } = ecoFlow;
    if (!_.isUndefined(flowName) && !_.isEmpty(flowName)) {
      if (!(await this.isFlow(flowName))) return {};
      const result: FlowDefinitions = Object.create({});
      result[flowName] = JSON.parse(
        await fse.readFile(
          path.join(
            this.flowDir,
            flowName,
            `definitions_${this.flowNodeDefinitions}`
          ),
          "utf8"
        )
      );
      return result;
    }
    const result = Object.create({});
    for await (const flowName of await this.flows)
      Object.assign(result, {
        ...result,
        ...(await this.getFlowDefinitions(flowName)),
      });
    return result;
  }

  /**
   * Asynchronously retrieves the flow connections for a given flow name.
   * If no flow name is provided, retrieves connections for all flows.
   * @param {string} [flowName] - The name of the flow to retrieve connections for.
   * @returns {Promise<FlowConnections>} A promise that resolves to an object containing flow connections.
   */
  async getFlowConnections(flowName?: string): Promise<FlowConnections> {
    const { _ } = ecoFlow;
    if (!_.isUndefined(flowName) && !_.isEmpty(flowName)) {
      if (!(await this.isFlow(flowName))) return {};
      const result: FlowConnections = Object.create({});
      result[flowName] = JSON.parse(
        await fse.readFile(
          path.join(
            this.flowDir,
            flowName,
            `connections_${this.flowNodeConnections}`
          ),
          "utf8"
        )
      );
      return result;
    }
    const result = Object.create({});
    for await (const flowName of await this.flows)
      Object.assign(result, {
        ...result,
        ...(await this.getFlowConnections(flowName)),
      });
    return result;
  }

  /**
   * Retrieves the configurations for a specific flow or for all flows if no flow name is provided.
   * @param {string} [flowName] - The name of the flow to retrieve configurations for.
   * @returns {Promise<FlowConfigurations>} A promise that resolves to an object containing the configurations for the specified flow.
   */
  async getFlowConfigurations(flowName?: string): Promise<FlowConfigurations> {
    const { _ } = ecoFlow;
    if (!_.isUndefined(flowName) && !_.isEmpty(flowName)) {
      if (!(await this.isFlow(flowName))) return {};
      const result: FlowConfigurations = Object.create({});
      result[flowName] = JSON.parse(
        await fse.readFile(
          path.join(
            this.flowDir,
            flowName,
            `configurations_${this.flowNodeConfigurations}`
          ),
          "utf8"
        )
      );
      return result;
    }
    const result = Object.create({});
    for await (const flowName of await this.flows)
      Object.assign(result, {
        ...result,
        ...(await this.getFlowConfigurations(flowName)),
      });
    return result;
  }

  /**
   * Retrieves the description of a specific flow or all flows if no flow name is provided.
   * @param {string} [flowName] - The name of the flow to retrieve the description for.
   * @returns {Promise<FlowsDescription>} A promise that resolves to an object containing the descriptions of the flow(s).
   */
  async flowsDescription(flowName?: string): Promise<FlowsDescription> {
    const { _ } = ecoFlow;
    if (!_.isUndefined(flowName) && !_.isEmpty(flowName)) {
      if (!(await this.isFlow(flowName))) return {};
      const result: FlowsDescription = Object.create({});
      result[flowName] = {
        definitions: (await this.getFlowDefinitions(flowName))[flowName].map(
          (definition) => ({ ...definition, selected: false })
        ),
        connections: (await this.getFlowConnections(flowName))[flowName].map(
          (connection) => ({ ...connection, selected: false })
        ),
        configurations: (await this.getFlowConfigurations(flowName))[flowName],
      };
      return result;
    }
    const result = Object.create({});
    for await (const flowName of await this.flows)
      Object.assign(result, {
        ...result,
        ...(await this.flowsDescription(flowName)),
      });
    return result;
  }

  /**
   * Asynchronously initializes the object and deploys the existing flow.
   * @returns {Promise<this>} A Promise that resolves to the initialized object.
   */
  async initialize(): Promise<this> {
    const { _, log } = ecoFlow;
    log.info("Initializing the existing flow...");
    const flowDescriptions = await this.flowsDescription();
    try {
      await this.deploy(flowDescriptions);
    } catch (error: string | any) {
      _.isString(error) ? log.error(error) : log.error(error.msg);
    }
    return this;
  }

  /**
   * Checks if all nodes in the given FlowDefinitions or FlowsDescription are configured.
   * @param {FlowDefinitions | FlowsDescription} definitions - The definitions of the flow or description.
   * @returns {boolean} True if all nodes are configured, false otherwise.
   */
  isAllNodesConfigured(
    definitions: FlowDefinitions | FlowsDescription
  ): boolean {
    const { _ } = ecoFlow;
    const nodes: Nodes = [];
    Object.keys(definitions).map((key) => {
      if (_.has(definitions[key], "definitions"))
        nodes.push(...(<Descriptions>definitions[key]).definitions);
      else nodes.push(...(<Nodes>definitions[key]));
    });

    if (nodes.filter((n) => !n.data.configured).length > 0) return false;

    return true;
  }

  /**
   * Checks if a given node is configured.
   * @param {Node} node - The node to check.
   * @returns {boolean} True if the node is configured, false otherwise.
   */
  isNodeConfigured(node: Node): boolean {
    return node.data.configured || false;
  }

  /**
   * Asynchronously deploys a flow based on the provided flow description.
   * @param {FlowsDescription} flowDescription - The description of the flow to deploy.
   * @returns {Promise<boolean>} A promise that resolves to true if the deployment is successful.
   * @throws {Error} If there is an error during the deployment process.
   */
  async deploy(
    flowDescription: FlowsDescription,
    current: boolean = false
  ): Promise<boolean> {
    const { _, log } = ecoFlow;
    /**
     * Asynchronously builds a stack, registers an API router builder, empties the flow directory,
     * updates flow node definitions, connections, and configurations for each flow in the flow description.
     * @param {Object} flowDescription - The description of the flow.
     * @returns {boolean} - Returns true if the process is successful.
     * @throws {Error} - Throws an error if any of the steps fail.
     */
    try {
      /**
       * Builds a stack using the provided flow description.
       * @param {Object} flowDescription - The description of the flow to build the stack from.
       * @returns {Array} An array containing the stack and configurations generated from the flow description.
       */
      const [stack, configurations] = await this.fLowBuilder.buildStack({
        ...flowDescription,
      });

      /**
       * Asynchronously builds configuration nodes using the provided flow description.
       * @param {Object} flowDescription - The description of the flow to build configuration nodes for.
       * @returns {Promise} A promise that resolves with the configuration node configurations.
       */
      const configNodeConfigurations = await this.fLowBuilder.buildConfigNodes({
        ...flowDescription,
      });

      /**
       * Registers node configurations for error handling.
       * @param {ConfigNode[]} configNodeConfigurations - An array of node configurations to register.
       * @returns {Promise<Node[]>} - A promise that resolves to an array of registered error nodes.
       */
      const errorNodes = await this.registerNodeConfigurations(
        configNodeConfigurations
      );

      /**
       * Throws an error if there are any error nodes present during configuration registration.
       * @param {Array} errorNodes - An array of error nodes.
       * @throws {Object} An object containing the error message and the IDs of the error nodes.
       */
      if (errorNodes.length > 0)
        throw {
          msg: `Error registering configurations for nodes: ${errorNodes.join(
            ", "
          )}`,
          nodesID: errorNodes,
        };

      /**
       * Initializes a new instance of EcoAPIRouterBuilder with the given stack and configurations,
       * then calls the initializeBuilder method to build the API router.
       * @param {Stack} stack - The stack object to build the API router on.
       * @param {Configurations} configurations - The configurations for the API router.
       * @returns {Promise<void>} A promise that resolves when the API router is built.
       */
      const apiRouterBuilder = await new EcoAPIRouterBuilder(
        stack,
        configurations
      ).initializeBuilder();

      /**
       * Registers the given API router builder with the EcoAPIBuilder.
       * @param {ApiRouterBuilder} apiRouterBuilder - The API router builder to register.
       * @returns None
       */
      EcoAPIBuilder.register(apiRouterBuilder);

      /**
       * If the 'current' variable is falsy, empties the directory located at 'this.flowDir'.
       * @param {any} current - The variable to check for falsy value.
       * @returns None
       */
      if (!current) await fse.emptyDir(path.join(this.flowDir));

      /**
       * Asynchronously updates the flow node definitions, connections, and configurations
       * for each flow in the flowDescription object.
       * @param {Object} flowDescription - An object containing flow names as keys and
       * their corresponding definitions, connections, and configurations.
       * @returns None
       */
      for await (const flowName of Object.keys(flowDescription)) {
        /**
         * Update the flow node definitions for a given flow name.
         * @param {string} flowName - The name of the flow.
         * @param {Object} definitions - The definitions to update for the flow.
         * @returns None
         */
        await this.updateFlowNodeDefinitions(
          flowName,
          flowDescription[flowName].definitions
        );

        /**
         * Update the connections of a flow node in the flow with the given name.
         * @param {string} flowName - The name of the flow to update.
         * @param {Array} connections - The connections to update for the flow node.
         * @returns None
         */
        await this.updateFlowNodeConnections(
          flowName,
          flowDescription[flowName].connections
        );

        /**
         * Update the configurations of a flow node.
         * @param {string} flowName - The name of the flow.
         * @param {Object} configurations - The configurations to update for the flow node.
         * @returns None
         */
        await this.updateFlowNodeConfigurations(
          flowName,
          flowDescription[flowName].configurations
        );
      }
      return true;
    } catch (error: any) {
      log.error(_.isString(error) ? error : error.msg);
      throw error;
    }
  }

  /**
   * Asynchronously retrieves a list of flows by scanning the directory for flow files.
   * @returns A Promise that resolves to an array of strings representing the flow names.
   */
  get flows(): Promise<string[]> {
    return new Promise<string[]>(async (resolve) => {
      const result: string[] = [];
      for await (const filePath of await glob(path.join(this.flowDir) + "/*")) {
        if (
          (await fse.lstat(filePath)).isDirectory() &&
          (await fse.exists(
            path.join(filePath, `definitions_${this.flowNodeDefinitions}`)
          )) &&
          (await fse.exists(
            path.join(filePath, `connections_${this.flowNodeConnections}`)
          )) &&
          (await fse.exists(
            path.join(filePath, `configurations_${this.flowNodeConfigurations}`)
          ))
        )
          result.push(path.basename(filePath));
      }
      resolve(result);
    });
  }

  /**
   * Getter method to retrieve the IEcoFlowBuilder instance.
   * @returns {IEcoFlowBuilder} - The IEcoFlowBuilder instance.
   */
  get fLowBuilder(): IEcoFLowBuilder {
    return this._flowBuilder;
  }
}
