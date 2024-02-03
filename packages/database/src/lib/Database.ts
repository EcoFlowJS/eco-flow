import {
  Database as IDatabase,
  DB_Drivers,
  DatabaseConnectionConfig,
  DatabaseConnection,
  ConnectionConfig,
  DriverMongoose as IDriverMongoose,
  DriverKnex as IDriverKnex,
  DBConfig,
  ConnectionList,
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
  private drivers: Map<string, DB_Drivers> = new Map<string, DB_Drivers>();

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

    const configs: DatabaseConnectionConfig[] = JSON.parse(
      <string>(<unknown>await fse.readFile(configLocation, "utf8"))
    );

    if (configs.length === 0) return [];

    return configs;
  }

  private async addConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig,
    isSystem: boolean = false
  ): Promise<[boolean, String | { error: any }]> {
    const { log } = ecoFlow;
    while (/[-!$%^&*()_+|~=`{}[:;<>?,.@#\]]/g.test(name.charAt(0)) && !isSystem)
      name = name.substring(1);
    try {
      log.info(`Adding Databaase Connection ${name}`);
      const [status, DBconnection, error] = await this.createConnections(
        driver,
        connection
      );

      if (status && DBconnection != null && !this.connections.has(name)) {
        this.connections.set(name, DBconnection);
        this.drivers.set(name, driver);
        log.info(`Databaase Connection Added named : ${name}`);
        return [true, "Connection Successfully"];
      } else if (this.connections.has(name)) {
        log.info(`Databaase Connection already exists with name : ${name}`);
        return [false, "Connection already exists"];
      } else {
        log.info(`Error while adding Databaase Connection with name : ${name}`);
        return [false, error];
      }
    } catch (error) {
      return [false, { error: error }];
    }
  }

  private async createConnections(
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<[boolean, IDriverKnex | IDriverMongoose | null, any]> {
    const con = { ...connection };
    if (typeof con === "undefined") return [false, null, null];
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

          return [true, mongo, null];
        } catch (error) {
          return [false, null, error];
        }
      case "MYSQL":
        return await this.processKnexClient("mysql", con);
      case "PGSQL":
        return await this.processKnexClient("pg", con);
      default:
        ecoFlow.log.info("Invalid DataBase Driver");
        return [false, null, null];
    }
  }

  private async processKnexClient(
    client: DBConfig["client"],
    config: ConnectionConfig
  ): Promise<[boolean, IDriverKnex | IDriverMongoose | null, any]> {
    return new Promise<[boolean, IDriverKnex | IDriverMongoose | null, any]>(
      async (resolve) => {
        try {
          const driver = new DriverKnex();
          if (typeof config.filename !== "undefined")
            await fse.ensureFile(config.filename!);
          await driver.createConnection({
            client: client,
            connection: {
              ...config,
              ssl:
                typeof config.ssl !== "undefined" && config.ssl
                  ? { rejectUnauthorized: false }
                  : false,
            },
            useNullAsDefault: true,
          });
          await driver.rawBuilder("SELECT 1");
          resolve([true, driver, null]);
        } catch (error) {
          resolve([false, null, error]);
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
    this.drivers.set(name, driver);

    return this.connections.has(name)
      ? [true, "Connection Updation Successful!"]
      : [false, "Connection Updation failed!"];
  }

  private async initSystemConnection(): Promise<void> {
    const { database, DB_Directory } = ecoFlow.config._config;
    let { driver, configuration } = database!;
    driver = _.isUndefined(driver) ? "SQLite" : driver;
    configuration = _.isUndefined(configuration)
      ? {
          filename: path.join(
            DB_Directory!,
            "DB_connections",
            "ecoflowDB.sqlite"
          ),
        }
      : configuration;

    const [status, msg] = await this.addConnection(
      "_sysDB",
      driver,
      configuration,
      true
    );

    if (status) ecoFlow.log.info("System DataBase " + msg);
    else ecoFlow.log.error(msg);
  }

  async initConnection(): Promise<void> {
    await this.initSystemConnection();
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
    } catch (err) {
      ecoFlow.log.error(err);
    }
  }

  async getDatabaseConfig(
    ConnectionName?: string
  ): Promise<DatabaseConnectionConfig[]> {
    const config = await this.getConfigurations();
    if (_.isUndefined(ConnectionName)) return config;
    return config.filter((val) => val.name === ConnectionName);
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

  get connectionList(): ConnectionList[] {
    return [...this.connections.keys()]
      .filter((val) => !val.startsWith("_"))
      .map((val) => {
        return { connectionsName: val, driver: this.drivers.get(val)! };
      });
  }

  get counntConnections(): number {
    return this.connectionList.length;
  }
}
