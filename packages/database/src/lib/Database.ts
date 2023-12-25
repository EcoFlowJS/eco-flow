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
import Helper from "@eco-flow/helper";
import { Builder } from "@eco-flow/utils";

export class Database implements IDatabase {
  private connections: Map<string, DatabaseConnection> = new Map<
    string,
    DatabaseConnection
  >();

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

    return configs;
  }

  private async addConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<[boolean, String | { error: any }]> {
    return new Promise<[boolean, String | { error: any }]>(async (resolve) => {
      try {
        const [status, DBconnection] = await this.createConnections(
          driver,
          connection
        );

        if (status && DBconnection != null && !this.connections.has(name)) {
          this.connections.set(name, DBconnection);
          resolve([true, "Connection Successfully"]);
        } else if (this.connections.has(name))
          resolve([false, "Connection already exists"]);
        else resolve([false, "Connection Failed"]);
      } catch (error) {
        resolve([false, { error: error }]);
      }
    });
  }

  private async createConnections(
    driver: DB_Drivers,
    con: ConnectionConfig
  ): Promise<[boolean, IDriverKnex | IDriverMongoose | null]> {
    if (typeof con === "undefined") return [false, null];
    if (typeof con === "object") {
      Object.keys(con).forEach((key) => {
        (<any>con)[key] = Helper.fetchFromEnv((<any>con)[key].toString());
      });
    }
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

  private async processKnexClient(
    client: DBConfig["client"],
    config: ConnectionConfig
  ): Promise<[boolean, IDriverKnex | IDriverMongoose]> {
    return new Promise<[boolean, IDriverKnex | IDriverMongoose]>(
      async (resolve) => {
        try {
          const driver = new DriverKnex();
          if (typeof config.filename !== "undefined")
            await fse.ensureFile(config.filename!);
          await driver.createConnection({
            client: client,
            connection: {
              ...config,
            },
            useNullAsDefault: true,
          });
          await driver.rawBuilder("SELECT 1");
          resolve([true, driver]);
        } catch (error) {
          resolve([false, error]);
        }
      }
    );
  }

  private async saveConfigurations(
    Mode: "ADD" | "DELETE" | "UPDATE",
    config: DatabaseConnectionConfig
  ): Promise<void> {
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

    const configs = _.cloneDeep(await this.getConfigurations());
    if (
      Mode === "ADD" &&
      typeof config.driver !== "undefined" &&
      typeof config.connections !== "undefined"
    ) {
      configs.push(config);
      await this.writeConfig(configs, configLocation);
    }
    if (
      Mode === "DELETE" &&
      typeof config.driver === "undefined" &&
      typeof config.connections === "undefined"
    ) {
      const newConfigs = configs.filter((cfg) => cfg.name !== config.name);
      await this.writeConfig(newConfigs, configLocation);
    }
    if (
      Mode === "UPDATE" &&
      typeof config.driver !== "undefined" &&
      typeof config.connections !== "undefined"
    ) {
      const connection = await this.getConfigurations();
      const newconnection = connection.filter(
        (cfg) => cfg.name !== config.name
      );
      newconnection.push(config);
      await this.writeConfig(newconnection, configLocation);
    }
  }

  private async writeConfig(
    config: DatabaseConnectionConfig[],
    configLocation: string
  ): Promise<void> {
    if (!(await fse.exists(configLocation)))
      Builder.JSON.toFile(configLocation, config, {}, null, 2);
    else fse.writeFile(configLocation, Builder.JSON.stringify(config, null, 2));
  }

  private removeConnection(name: string): [boolean, String] {
    if (!this.connections.has(name)) return [false, "Connection not exist!!!"];
    this.connections.delete(name);
    return [!this.connections.has(name), "Connection removed successful..."];
  }

  private async updateConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<[boolean, string]> {
    const [status, DBconnection] = await this.createConnections(
      driver!,
      connection!
    );

    if (!status)
      return [false, "Connection could not be created to the database"];
    if (status && DBconnection === null)
      return [false, "Connection not connected to database!"];
    if (!status && DBconnection === null)
      return [false, "Connection not connected to database!"];

    this.connections.set(name, DBconnection!);

    return this.connections.has(name)
      ? [true, "Connection Updation Successful!"]
      : [false, "Connection Updation failed!"];
  }

  async initConnection(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const savedConfig = _.cloneDeep(await this.getConfigurations());
        if (_.isEmpty(savedConfig)) return;
        for (const config of savedConfig) {
          if (
            typeof config.driver !== "undefined" &&
            typeof config.connections !== "undefined"
          )
            await this.addConnection(
              config.name,
              config.driver,
              config.connections
            );
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  getDatabaseConnection(name: string): any {
    return this.connections.get(name);
  }

  async addDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<[boolean, string]> {
    const config = _.cloneDeep(connection);
    const [status, msg] = await this.addConnection(name, driver, connection);

    if (!status)
      return [status, typeof msg === "string" ? msg : JSON.stringify(msg)];

    if (status)
      await this.saveConfigurations("ADD", {
        name: name,
        driver: driver,
        connections: config,
      });

    return [status, msg.toString()];
  }

  async removeDatabaseConnection(name: string): Promise<[boolean, String]> {
    const [status, msg] = this.removeConnection(name);

    if (!status)
      return [status, typeof msg === "string" ? msg : JSON.stringify(msg)];

    if (status)
      await this.saveConfigurations("DELETE", {
        name: name,
      });

    return [status, msg];
  }

  async updateDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<[boolean, string]> {
    if (!this.connections.has(name)) return [false, "Connection not exists!!!"];
    const config = _.cloneDeep(connection);
    const [status, msg] = await this.updateConnection(name, driver, connection);
    if (!status)
      return [status, typeof msg === "string" ? msg : JSON.stringify(msg)];

    if (status)
      await this.saveConfigurations("UPDATE", {
        name: name,
        driver: driver,
        connections: config,
      });

    return [status, msg];
  }

  isKnex(connection: any): connection is IDriverKnex {
    return connection instanceof DriverKnex;
  }
  isMongoose(connection: any): connection is IDriverMongoose {
    return connection instanceof DriverMongoose;
  }
}
