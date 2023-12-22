import {
  Database as IDatabase,
  DB_Drivers,
  DatabaseConnectionConfig,
  DatabaseConnection,
  ConnectionConfig,
} from "@eco-flow/types";
import fse from "fs-extra";
import path from "path";

export class Database implements IDatabase {
  private connections: Map<string, DatabaseConnection> = new Map<
    string,
    DatabaseConnection
  >();

  private async saveConfigurations(): Promise<void> {}

  private async getConfigurations(): Promise<DatabaseConnectionConfig[]> {
    await fse.ensureDir(ecoFlow.config._config.DB_ConnectionsDir!);
    const configLocation: string = path.join(
      ecoFlow.config._config.DB_ConnectionsDir!,
      "connectionsConfig.json"
    );

    if (!(await fse.exists(configLocation))) return [];

    const configs: DatabaseConnectionConfig[] = require(configLocation);

    if (configs.length === 0) return [];

    configs.forEach((config) => {
      if (typeof config.connections === "undefined") return;
      if (typeof config.connections === "string") {
        this.processENVs(config.connections);
      }
      if (typeof config.connections === "object") {
        Object.keys(config["connections"]!).forEach((key) => {
          (<any>config.connections)![key] = this.processENVs(
            <string>(<any>config.connections)![key]
          );
        });
      }
    });

    return configs;
  }

  private processENVs(env: string): string | undefined {
    if (env.startsWith("env(") && env.endsWith(")")) {
      return process.env[env.substring(4, env.length - 1)];
    }
    return env;
  }

  createConnections(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ) {}

  async initConnection(): Promise<void> {
    const config = await this.getConfigurations();

    return new Promise<void>((resolve, reject) => {
      config.forEach((config) => {
        if (this.connections.has(config.name)) return;
        try {
          this.createConnections(
            config.name,
            config.driver,
            <ConnectionConfig>config.connections
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  getDatabaseConnection(name: string): void {}

  removeDatabaseConnection(name: string): void {}

  updateDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ) {}
}
