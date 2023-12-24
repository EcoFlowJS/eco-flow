import {
  Database as IDatabase,
  DB_Drivers,
  DatabaseConnectionConfig,
  DatabaseConnection,
  ConnectionConfig,
  DriverMongoose as IDriverMongoose,
  DriverKnex as IDriverKnex,
} from "@eco-flow/types";
import fse from "fs-extra";
import path from "path";
import { DriverKnex } from "../drivers";
import _ from "lodash";
import knex from "knex";

export class Database implements IDatabase {
  private connections: Map<string, DatabaseConnection> = new Map<
    string,
    DatabaseConnection
  >();

  private async saveConfigurations(): Promise<void> {}

  private async getConfigurations(): Promise<DatabaseConnectionConfig[]> {
    if (_.isEmpty(ecoFlow.config._config.DB_Directory))
      ecoFlow.config._config.DB_Directory = path.join(
        ecoFlow.config.get("userDir"),
        "Database"
      );
    if (
      !(await fse.exists(
        path.join(ecoFlow.config._config.DB_Directory!, "configs")
      ))
    )
      ecoFlow.log.info(
        "Creating database connection configuration directory..."
      );
    await fse.ensureDir(
      path.join(ecoFlow.config._config.DB_Directory!, "configs")
    );
    const configLocation: string = path.join(
      ecoFlow.config._config.DB_Directory!,
      "configs",
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

  async createConnections(
    driver: DB_Drivers,
    con: String | ConnectionConfig
  ): Promise<[boolean, IDriverKnex | IDriverMongoose | null]> {
    switch (driver) {
      case "SQLite":
        try {
          const sqlite = new DriverKnex();
          await fse.ensureFile((<ConnectionConfig>con).filename!);
          await sqlite.createConnection({
            client: "sqlite3",
            connection:
              typeof con === "string"
                ? con
                : {
                    ...(<ConnectionConfig>con),
                  },
            useNullAsDefault: true,
          });
          await sqlite.rawBuilder("SELECT 1");
          return [true, sqlite];
        } catch {
          return [false, null];
        }
      case "MONGO":
        break;
      case "MYSQL":
        try {
          const mysql = new DriverKnex();
          await mysql.createConnection({
            client: "mysql",
            connection:
              typeof con === "string"
                ? con
                : {
                    ...(<ConnectionConfig>con),
                  },
          });
          await mysql.rawBuilder("SELECT 1");
          return [true, mysql];
        } catch {
          return [false, null];
        }
      case "PGSQL":
        break;
      default:
        ecoFlow.log.info("Invalid DataBase Driver");
        break;
    }

    return [false, new DriverKnex()];
  }

  async initConnection(): Promise<void> {
    const config = await this.getConfigurations();
    console.log(
      await this.createConnections("MYSQL", {
        host: "192.168.254.31",
        port: 3306,
        user: "admin",
        password: "iwillhacku",
        database: "test",
      })
    );

    return new Promise<void>((resolve, reject) => {
      config.forEach((config) => {
        if (this.connections.has(config.name)) return;
        try {
          // this.createConnections(
          //   config.name,
          //   config.driver,
          //   config.connections
          // );
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  getDatabaseConnection(name: string): void {}

  addDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: String | ConnectionConfig
  ): void {}

  removeDatabaseConnection(name: string): void {}

  updateDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: String | ConnectionConfig
  ) {}
}
