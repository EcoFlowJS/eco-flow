import {
  FlowConfigurations,
  FlowConnections,
  FlowDefinitions,
  FlowsDescription,
  EcoFlowEditor as IEcoFlowEditor,
  configOptions,
} from "@ecoflow/types";
import { glob } from "glob";
import path from "path";
import fse from "fs-extra";
import type { Node } from "@reactflow/core";

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

  private async updateFlowNodeDefinitions(
    flowName: string,
    value?: Node
  ): Promise<this> {
    await fse.ensureFile(
      path.join(
        this.flowDir,
        flowName,
        `definitions_${this.flowNodeDefinitions}`
      )
    );

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

  private async updateFlowNodeConnections(
    flowName: string,
    value?: Node
  ): Promise<this> {
    await fse.ensureFile(
      path.join(
        this.flowDir,
        flowName,
        `connections_${this.flowNodeConnections}`
      )
    );

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

  private async updateFlowNodeConfigurations(
    flowName: string,
    value?: Node
  ): Promise<this> {
    await fse.ensureFile(
      path.join(
        this.flowDir,
        flowName,
        `configurations_${this.flowNodeConfigurations}`
      )
    );

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

  async createFlow(flowName: string): Promise<void> {
    if ((await this.flows).includes(flowName)) throw "Flow already exists.";

    await fse.ensureDir(path.join(this.flowDir, flowName));
    await (
      await (
        await this.updateFlowNodeDefinitions(flowName)
      ).updateFlowNodeConnections(flowName)
    ).updateFlowNodeConfigurations(flowName);
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
            await this.updateFlowNodeDefinitionsFile(
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
            await this.updateFlowNodeConnectionsFile(
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

  async removeFlow(flowName: string): Promise<void> {
    if (!(await this.flows).includes(flowName)) throw "Flow doesn't exists.";

    await fse.remove(path.join(this.flowDir, flowName));
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

  async flowsDescription(flowName?: string): Promise<FlowsDescription> {
    const { _ } = ecoFlow;
    if (!_.isUndefined(flowName) && !_.isEmpty(flowName)) {
      if (!(await this.isFlow(flowName))) return {};
      const result: FlowsDescription = Object.create({});
      result[flowName] = {
        definitions: (await this.getFlowDefinitions(flowName))[flowName],
        connections: (await this.getFlowConnections(flowName))[flowName],
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

  async build(): Promise<this> {
    console.log("build");
    return this;
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
