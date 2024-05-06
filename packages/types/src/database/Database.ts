import { MongooseOptions } from "mongoose";
import { DriverKnex, DriverMongoose, KnexDB_Driver } from "./drivers";

/**
 * Interface for managing database connections.
 */
export interface Database {
  /**
   * Initializes the connection by setting up the system connection and adding saved configurations.
   * @returns Promise<void>
   */
  initConnection(): Promise<void>;

  /**
   * Retrieves the database configuration based on the provided connection name.
   * If no connection name is provided, returns all database connection configurations.
   * @param {string} [ConnectionName] - The name of the database connection to retrieve configuration for.
   * @returns {Promise<DatabaseConnectionConfig[]>} A promise that resolves to an array of database connection configurations.
   */
  getDatabaseConfig(
    ConnectionName?: string
  ): Promise<DatabaseConnectionConfig[]>;

  /**
   * Retrieves a database connection by name.
   * @param {string} name - The name of the database connection to retrieve.
   * @returns The database connection associated with the given name.
   */
  getDatabaseConnection(name: string): any;

  /**
   * Validates a database connection using the specified driver and connection configuration.
   * @param {DB_Drivers} driver - The database driver to use for the connection.
   * @param {ConnectionConfig} connection - The configuration object for the connection.
   * @returns {Promise<boolean>} A promise that resolves to true if the connection is successful, false otherwise.
   */
  validateConnection(
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<boolean>;

  /**
   * Asynchronously adds a database connection with the given parameters.
   * @param {string} name - The name of the database connection.
   * @param {DB_Drivers} driver - The driver for the database connection.
   * @param {ConnectionConfig} connection - The configuration details for the connection.
   * @param {boolean} [isSystem=false] - Indicates if the connection is a system connection.
   * @returns A promise that resolves to a tuple containing a boolean status and a message string.
   */
  addDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig,
    isSystem?: boolean
  ): Promise<[boolean, string]>;

  /**
   * Asynchronously removes a database connection with the given name.
   * @param {string} name - The name of the database connection to remove.
   * @returns {Promise<[boolean, string]>} A promise that resolves to a tuple containing a boolean
   * indicating the success status of the removal operation and a string message.
   */
  removeDatabaseConnection(name: string): Promise<[boolean, String]>;

  /**
   * Updates the database connection with the given name, driver, and connection configuration.
   * @param {string} name - The name of the database connection to update.
   * @param {DB_Drivers} driver - The driver type of the database connection.
   * @param {ConnectionConfig} connection - The new connection configuration to update.
   * @returns A promise that resolves to a tuple containing a boolean indicating the success status
   * and a string message describing the result of the update operation.
   */
  updateDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<[boolean, string]>;

  /**
   * Checks if the given connection is an instance of DriverKnex.
   * @param {any} connection - The connection to check.
   * @returns {boolean} True if the connection is an instance of IDriverKnex, false otherwise.
   */
  isKnex(connection: any): connection is DriverKnex;

  /**
   * Checks if the given connection is an instance of DriverMongoose.
   * @param {any} connection - The connection to check.
   * @returns {boolean} True if the connection is an instance of IDriverMongoose, false otherwise.
   */
  isMongoose(connection: any): connection is DriverMongoose;

  /**
   * Returns a list of connections in the form of ConnectionList objects.
   * Filters out connections that start with an underscore.
   * @returns An array of ConnectionList objects containing connection name and driver information.
   */
  get connectionList(): ConnectionList[];

  /**
   * Get the number of connections in the connection list.
   * @returns The number of connections in the connection list.
   */
  get counntConnections(): number;
}

/**
 * Interface representing a connection list entry.
 * @interface ConnectionList
 * @property {string} connectionsName - The name of the connection.
 * @property {DB_Drivers} driver - The driver used for the connection.
 */
export interface ConnectionList {
  connectionsName: string;
  driver: DB_Drivers;
}

/**
 * Defines a custom type DB_Drivers which can be either KnexDB_Driver or "MONGO".
 */
export type DB_Drivers = KnexDB_Driver | "MONGO";

/**
 * Represents a database connection that can be either a DriverKnex or a DriverMongoose.
 */
export type DatabaseConnection = DriverKnex | DriverMongoose;

/**
 * Represents the configuration for a database connection.
 * @interface DatabaseConnectionConfig
 * @property {string} name - The name of the database connection.
 * @property {DB_Drivers} [driver] - The driver to use for the connection.
 * @property {ConnectionConfig} [connections] - The configuration for the connections.
 */
export interface DatabaseConnectionConfig {
  name: string;
  driver?: DB_Drivers;
  connections?: ConnectionConfig;
}

/**
 * Interface representing the configuration options for establishing a connection.
 * @property {string} [connectionString] - The connection string to connect to the database.
 * @property {string} [host] - The host of the database server.
 * @property {number} [port] - The port number of the database server.
 * @property {string} [user] - The username for authentication.
 * @property {string} [password] - The password for authentication.
 * @property {string} [database] - The name of the database to connect to.
 * @property {boolean} [ssl] - Whether to use SSL for the connection.
 * @property {string} [filename] - The filename of the database (
 */
export interface ConnectionConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  ssl?: boolean;
  filename?: string;
  flags?: Array<any>;
  mongooseOptions?: MongooseOptions;
}
