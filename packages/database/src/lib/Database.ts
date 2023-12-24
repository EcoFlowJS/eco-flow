import {
  Database as IDatabase,
  DB_Drivers,
  DatabaseConnectionConfig,
  DatabaseConnection,
  ConnectionConfig,
  DriverMongoose as IDriverMongoose,
  DriverKnex as IDriverKnex,
  DBConfig,
} from "@eco-flow/types";
import fse from "fs-extra";
import path from "path";
import { DriverKnex, DriverMongoose } from "../drivers";
import _ from "lodash";

export class Database implements IDatabase {
  private connections: Map<string, DatabaseConnection> = new Map<
    string,
    DatabaseConnection
  >();

  private async saveConfigurations(
    config: DatabaseConnectionConfig
  ): Promise<void> {}

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

  private async addConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      if (this.connections.has(name)) return;
      try {
        const [status, DBconnection] = await this.createConnections(
          driver,
          connection
        );

        if (status && DBconnection != null)
          this.connections.set(name, DBconnection);
        resolve();
      } catch {
        reject();
      }
    });
  }

  private removeConnection(name: string): void {
    this.connections.delete(name);
  }

  private async updateConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const [status, DBconnection] = await this.createConnections(
          driver,
          connection
        );

        if (status && DBconnection != null)
          this.connections.set(name, DBconnection);
        resolve();
      } catch {
        reject();
      }
    });
  }

  private processENVs(env: string): string | undefined {
    if (env.startsWith("env(") && env.endsWith(")")) {
      return process.env[env.substring(4, env.length - 1)];
    }
    return env;
  }

  private async processKnexClient(
    client: DBConfig["client"],
    config: ConnectionConfig
  ): Promise<[boolean, IDriverKnex | IDriverMongoose]> {
    return new Promise<[boolean, IDriverKnex | IDriverMongoose]>(
      async (resolve, reject) => {
        try {
          const sqlite = new DriverKnex();
          if (typeof config.filename !== "undefined")
            await fse.ensureFile(config.filename!);
          await sqlite.createConnection({
            client: client,
            connection: {
              ...config,
            },
            useNullAsDefault: true,
          });
          await sqlite.rawBuilder("SELECT 1");
          resolve([true, sqlite]);
        } catch (error) {
          resolve([false, error]);
        }
      }
    );
  }

  private async createConnections(
    driver: DB_Drivers,
    con: ConnectionConfig
  ): Promise<[boolean, IDriverKnex | IDriverMongoose | null]> {
    switch (driver) {
      case "SQLite":
        return await this.processKnexClient("sqlite3", con);
      case "MONGO":
        try {
          const mongo = new DriverMongoose();
          await mongo.createConnection(
            typeof con.connectionString !== "string"
              ? ""
              : con.connectionString!,
            con.mongooseOptions
          );
          return [true, mongo];
        } catch (error) {
          return [false, error];
        }
      case "MYSQL":
        return await this.processKnexClient("mysql", con);
      case "PGSQL":
        return await this.processKnexClient("pg", con);
      default:
        ecoFlow.log.info("Invalid DataBase Driver");
        return [false, null];
    }
  }

  async initConnection(): Promise<void> {
    const config = await this.getConfigurations();
    return new Promise<void>((resolve, reject) => {
      config.forEach(async (config) => {
        try {
          await this.addConnection(
            config.name,
            config.driver,
            config.connections
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  getDatabaseConnection(name: string): any {
    return this.connections.get(name);
  }

  async addDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<void> {
    await this.addConnection(name, driver, connection);

    //TO-DO: save connection configuration
  }

  async removeDatabaseConnection(name: string): Promise<void> {
    this.removeConnection(name);

    //TO-DO: save connection configuration
  }

  async updateDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<void> {
    await this.updateConnection(name, driver, connection);

    //TO-DO: save connection configuration
  }

  isKnex(connection: any): connection is IDriverKnex {
    return connection instanceof DriverKnex;
  }
  isMongoose(connection: any): connection is IDriverMongoose {
    return connection instanceof DriverMongoose;
  }
}

// console.log(
//   await this.createConnections("MYSQL", {
//     host: "192.168.254.31",
//     port: 3306,
//     user: "admin",
//     password: "iwillhacku",
//     database: "test",
//   })
// );

// await this.addDatabaseConnection("MYSQL", "MYSQL", {
//   host: "192.168.254.31",
//   port: 3306,
//   user: "admin",
//   password: "iwillhacku",
//   database: "test",
// });
