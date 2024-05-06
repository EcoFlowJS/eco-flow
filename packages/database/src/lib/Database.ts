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
} from "@ecoflow/types";
import fse from "fs-extra";
import path from "path";
import { DriverKnex, DriverMongoose } from "../drivers";
import _ from "lodash";
import Helper from "@ecoflow/helper";
import { Builder } from "@ecoflow/utils";

/**
 * Represents a Database class that implements the Database interface.
 * This class manages database connections and configurations.
 */
export class Database implements IDatabase {
  /**
   * A private property that stores a mapping of connection names to DatabaseConnection objects.
   * @type {Map<string, DatabaseConnection>}
   */
  private connections: Map<string, DatabaseConnection> = new Map<
    string,
    DatabaseConnection
  >();

  /**
   * A private property that stores a mapping of driver names to their corresponding DB_Drivers objects.
   * @type {Map<string, DB_Drivers>}
   */
  private drivers: Map<string, DB_Drivers> = new Map<string, DB_Drivers>();

  /**
   * Retrieves the configurations for database connections.
   * If the DB_Directory is empty, it sets it to a default directory.
   * If the configurations directory does not exist, it creates it.
   * Reads the configurations from the connectionsConfig.json file.
   * @returns A Promise that resolves to an array of DatabaseConnectionConfig objects.
   */
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

  /**
   * Adds a new database connection with the given name, driver, and connection configuration.
   * @param {string} name - The name of the database connection.
   * @param {DB_Drivers} driver - The driver for the database connection.
   * @param {ConnectionConfig} connection - The configuration for the database connection.
   * @param {boolean} [isSystem=false] - Indicates if the connection is a system connection.
   * @returns A promise that resolves to a tuple containing a boolean indicating success or failure
   * and either a string message or an object with an error if an error occurred.
   */
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
      /**
       * Interface representing a connection list entry.
       * @interface ConnectionList
       * @property {string} connectionsName - The name of the connection.
       * @property {DB_Drivers} driver - The driver used for the connection.
       */

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

  /**
   * Creates database connections based on the specified driver and connection configuration.
   * @param {DB_Drivers} driver - The type of database driver to use.
   * @param {ConnectionConfig} connection - The configuration object for the database connection.
   * @returns A promise that resolves to a tuple containing a boolean indicating success,
   * the database driver instance (Knex or Mongoose), and any error that occurred during connection creation.
   */
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

    /**
     * Switches between different database drivers and processes them accordingly.
     * @param {string} driver - The database driver to use (SQLite, MONGO, MYSQL, PGSQL).
     * @param {object} con - The connection object containing necessary connection information.
     * @returns An array with the result of the operation based on the driver:
     * - For SQLite: Result of processing with Knex client for SQLite.
     * - For MONGO: [true, mongo, null] if successful, [false, null, error] if error occurs.
     * - For MYSQL: Result of processing with Knex client for MySQL.
     * - For PGSQL: Result of processing with Knex client for PostgreSQL.
     * - Default: [false, null
     */
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

  /**
   * Process the Knex client based on the provided client and connection configuration.
   * @param {DBConfig["client"]} client - The Knex client to use for the connection.
   * @param {ConnectionConfig} config - The connection configuration object.
   * @returns A promise that resolves to a tuple containing a boolean indicating success,
   * the driver instance (Knex or Mongoose), and any error that occurred during processing.
   */
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

          config.ssl =
            typeof config.ssl === "boolean"
              ? config.ssl
              : typeof config.ssl === "string" && config.ssl === "true"
              ? true
              : false;

          await driver.createConnection({
            client: client,
            connection: {
              ...config,
              ssl: config.ssl ? { rejectUnauthorized: false } : false,
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

  /**
   * Saves the database connection configurations based on the specified mode.
   * @param {("ADD" | "DELETE" | "UPDATE")} Mode - The mode of operation (ADD, DELETE, UPDATE).
   * @param {DatabaseConnectionConfig} config - The database connection configuration to save.
   * @returns {Promise<void>} A Promise that resolves when the configurations are saved.
   */
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

    /**
     * If the mode is "ADD" and both the driver and connections properties are defined in the config object,
     * the config object is added to the configs array and then written to the specified config location.
     * @param {object} config - The configuration object to be added.
     * @param {string} configLocation - The location where the configuration should be written.
     * @param {Array} configs - The array of configurations to which the new configuration is added.
     * @returns None
     */
    if (
      Mode === "ADD" &&
      typeof config.driver !== "undefined" &&
      typeof config.connections !== "undefined"
    ) {
      configs.push(config);
      await this.writeConfig(configs, configLocation);
    }

    /**
     * If the mode is set to "DELETE" and both the driver and connections properties are undefined in the config object,
     * filter out the config with the matching name and write the updated configs to the specified location.
     * @param {string} Mode - The mode of operation.
     * @param {object} config - The configuration object to check for deletion criteria.
     * @param {Array<object>} configs - The array of configuration objects to filter.
     * @param {string} configLocation - The location to write the updated configs to.
     * @returns None
     */
    if (
      Mode === "DELETE" &&
      typeof config.driver === "undefined" &&
      typeof config.connections === "undefined"
    ) {
      const newConfigs = configs.filter((cfg) => cfg.name !== config.name);
      await this.writeConfig(newConfigs, configLocation);
    }

    /**
     * Updates the configuration with the new connection details if the mode is "UPDATE"
     * and the driver and connections are defined in the config object.
     * @param {string} Mode - The mode of operation, must be "UPDATE".
     * @param {object} config - The configuration object containing driver and connections.
     * @param {string} configLocation - The location to write the updated configuration.
     * @returns None
     */
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

  /**
   * Writes the database connection configuration to a specified location.
   * @param {DatabaseConnectionConfig[]} config - The database connection configuration to write.
   * @param {string} configLocation - The location where the configuration will be written.
   * @returns {Promise<void>} A promise that resolves once the configuration is written.
   */
  private async writeConfig(
    config: DatabaseConnectionConfig[],
    configLocation: string
  ): Promise<void> {
    if (!(await fse.exists(configLocation)))
      Builder.JSON.toFile(configLocation, config, {}, null, 2);
    else fse.writeFile(configLocation, Builder.JSON.stringify(config, null, 2));
  }

  /**
   * Removes a connection with the given name from the connections map.
   * @param {string} name - The name of the connection to remove.
   * @returns {[boolean, string]} A tuple containing a boolean indicating if the connection was successfully removed
   * and a message indicating the result of the removal operation.
   */
  private removeConnection(name: string): [boolean, String] {
    if (!this.connections.has(name)) return [false, "Connection not exist!!!"];
    this.connections.delete(name);
    return [!this.connections.has(name), "Connection removed successful..."];
  }

  /**
   * Updates the connection with the given name using the specified driver and connection configuration.
   * @param {string} name - The name of the connection to update.
   * @param {DB_Drivers} driver - The driver to use for the connection.
   * @param {ConnectionConfig} connection - The configuration for the connection.
   * @returns A promise that resolves to a tuple containing a boolean indicating success or failure
   * and a string message describing the result of the update.
   */
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

  /**
   * Initializes the system connection by setting up the database configuration and adding the connection.
   * @returns A Promise that resolves to void.
   */
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

  /**
   * Initializes the connection by setting up the system connection and adding saved configurations.
   * @returns Promise<void>
   */
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

  /**
   * Retrieves the database configuration based on the provided connection name.
   * If no connection name is provided, returns all database connection configurations.
   * @param {string} [ConnectionName] - The name of the database connection to retrieve configuration for.
   * @returns {Promise<DatabaseConnectionConfig[]>} A promise that resolves to an array of database connection configurations.
   */
  async getDatabaseConfig(
    ConnectionName?: string
  ): Promise<DatabaseConnectionConfig[]> {
    const config = await this.getConfigurations();
    if (_.isUndefined(ConnectionName)) return config;
    return config.filter((val) => val.name === ConnectionName);
  }

  /**
   * Retrieves a database connection by name.
   * @param {string} name - The name of the database connection to retrieve.
   * @returns The database connection associated with the given name.
   */
  getDatabaseConnection(name: string): any {
    return this.connections.get(name);
  }

  /**
   * Asynchronously adds a database connection with the given parameters.
   * @param {string} name - The name of the database connection.
   * @param {DB_Drivers} driver - The driver for the database connection.
   * @param {ConnectionConfig} connection - The configuration details for the connection.
   * @param {boolean} [isSystem=false] - Indicates if the connection is a system connection.
   * @returns A promise that resolves to a tuple containing a boolean status and a message string.
   */
  async addDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig,
    isSystem: boolean = false
  ): Promise<[boolean, string]> {
    const config = _.cloneDeep(connection);
    const [status, msg] = await this.addConnection(
      name,
      driver,
      connection,
      isSystem
    );

    if (!status)
      return [status, typeof msg === "string" ? msg : JSON.stringify(msg)];

    if (!isSystem && status)
      await this.saveConfigurations("ADD", {
        name: name,
        driver: driver,
        connections: config,
      });

    return [status, msg.toString()];
  }

  /**
   * Validates a database connection using the specified driver and connection configuration.
   * @param {DB_Drivers} driver - The database driver to use for the connection.
   * @param {ConnectionConfig} connection - The configuration object for the connection.
   * @returns {Promise<boolean>} A promise that resolves to true if the connection is successful, false otherwise.
   */
  async validateConnection(
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<boolean> {
    try {
      const [status] = await this.createConnections(driver, connection);
      return status;
    } catch {
      return false;
    }
  }

  /**
   * Asynchronously removes a database connection with the given name.
   * @param {string} name - The name of the database connection to remove.
   * @returns {Promise<[boolean, string]>} A promise that resolves to a tuple containing a boolean
   * indicating the success status of the removal operation and a string message.
   */
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

  /**
   * Updates the database connection with the given name, driver, and connection configuration.
   * @param {string} name - The name of the database connection to update.
   * @param {DB_Drivers} driver - The driver type of the database connection.
   * @param {ConnectionConfig} connection - The new connection configuration to update.
   * @returns A promise that resolves to a tuple containing a boolean indicating the success status
   * and a string message describing the result of the update operation.
   */
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

    if (status && !name.startsWith("_"))
      await this.saveConfigurations("UPDATE", {
        name: name,
        driver: driver,
        connections: config,
      });

    return [status, msg];
  }

  /**
   * Checks if the given connection is an instance of DriverKnex.
   * @param {any} connection - The connection to check.
   * @returns {boolean} True if the connection is an instance of IDriverKnex, false otherwise.
   */
  isKnex(connection: any): connection is IDriverKnex {
    return connection instanceof DriverKnex;
  }

  /**
   * Checks if the given connection is an instance of DriverMongoose.
   * @param {any} connection - The connection to check.
   * @returns {boolean} True if the connection is an instance of IDriverMongoose, false otherwise.
   */
  isMongoose(connection: any): connection is IDriverMongoose {
    return connection instanceof DriverMongoose;
  }

  /**
   * Returns a list of connections in the form of ConnectionList objects.
   * Filters out connections that start with an underscore.
   * @returns An array of ConnectionList objects containing connection name and driver information.
   */
  get connectionList(): ConnectionList[] {
    return [...this.connections.keys()]
      .filter((val) => !val.startsWith("_"))
      .map((val) => {
        return { connectionsName: val, driver: this.drivers.get(val)! };
      });
  }

  /**
   * Get the number of connections in the connection list.
   * @returns The number of connections in the connection list.
   */
  get counntConnections(): number {
    return this.connectionList.length;
  }

  /**
   * Formats a given Date object into a string in the format 'YYYY-MM-DD HH:mm:ss'.
   * @param {Date} dateTime - The Date object to format.
   * @returns {string} A formatted string representing the date and time.
   */
  static formatKnexDateTime(dateTime: Date) {
    //Sql Format : YYYY-MM-DD HH:MI:SS

    /**
     * Pads a number with leading characters to a specified length.
     * @param {any} nr - The number to pad.
     * @param {number} [len=2] - The desired length of the padded number.
     * @param {string} [chr='0'] - The character to pad with.
     * @returns {string} The padded number as a string.
     */
    const padL = (nr: any, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

    return `${dateTime.getFullYear()}-${padL(dateTime.getMonth() + 1)}-${padL(
      dateTime.getDate()
    )} ${padL(dateTime.getHours())}:${padL(dateTime.getMinutes())}:${padL(
      dateTime.getSeconds()
    )}`;
  }
}
