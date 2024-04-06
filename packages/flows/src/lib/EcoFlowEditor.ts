import {
  FlowsDescription,
  EcoFlowEditor as IEcoFlowEditor,
  configOptions,
} from "@ecoflow/types";
import { glob } from "glob";
import path from "path";
import fse from "fs-extra";

export class EcoFlowEditor implements IEcoFlowEditor {
  private flowDir: string;
  private flowNodeDefinitions: string;
  private flowNodeConnections: string;
  private flowNodeConfigurations: string;
  private flowFilePretty: boolean;

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

    fse.ensureDirSync(this.flowDir, 0o2775);
  }

  private async updateFlowNodeDefinitions(
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

  private async updateFlowNodeConnections(
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

  private async updateFlowNodeConfigurations(
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

  async createFlow(flowName: string): Promise<boolean> {
    return false;
  }

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
    try {
      if (configs.flowDir) this.flowDir = configs.flowDir;
      if (configs.flowFilePretty) this.flowFilePretty = configs.flowFilePretty;

      if (newConfigs)
        for await (const flowName of await this.flows) {
          if (
            await fse.exists(
              path.join(
                this.flowDir,
                flowName,
                `definitions_${configs.flowNodeDefinitions}`
              )
            )
          )
            await this.updateFlowNodeDefinitions(
              flowName,
              configs.flowNodeDefinitions!,
              newConfigs.flowNodeDefinitions
            );

          if (
            await fse.exists(
              path.join(
                this.flowDir,
                flowName,
                `connections_${configs.flowNodeConnections}`
              )
            )
          )
            await this.updateFlowNodeConnections(
              flowName,
              configs.flowNodeConnections!,
              newConfigs.flowNodeConnections
            );

          if (
            await fse.exists(
              path.join(
                this.flowDir,
                flowName,
                `configurations_${configs.flowNodeConfigurations}`
              )
            )
          )
            await this.updateFlowNodeConfigurations(
              flowName,
              configs.flowNodeConfigurations!,
              newConfigs.flowNodeConfigurations
            );
        }
    } catch (e) {
      log.error(e);
    }
  }

  async removeFlow(flowName: string): Promise<boolean> {
    return false;
  }

  async build(): Promise<this> {
    console.log("build");
    return this;
  }

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

  async flowsDescription(flowName?: string): Promise<FlowsDescription | null> {
    const { _ } = ecoFlow;
    if (!_.isUndefined(flowName) && !_.isEmpty(flowName)) {
      if (!(await this.isFlow(flowName))) return null;
      const result: FlowsDescription = Object.create({});
      result[flowName] = {
        definitions: JSON.parse(
          await fse.readFile(
            path.join(
              this.flowDir,
              flowName,
              `definitions_${this.flowNodeDefinitions}`
            ),
            "utf8"
          )
        ),
        connections: JSON.parse(
          await fse.readFile(
            path.join(
              this.flowDir,
              flowName,
              `connections_${this.flowNodeConnections}`
            ),
            "utf8"
          )
        ),
        configurations: JSON.parse(
          await fse.readFile(
            path.join(
              this.flowDir,
              flowName,
              `configurations_${this.flowNodeConfigurations}`
            ),
            "utf8"
          )
        ),
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
}
