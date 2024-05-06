import knex, { Client, Knex } from "knex";
export type { Knex } from "knex";

/**
 * Interface for a Knex driver that provides methods for interacting with a database.
 */
export interface DriverKnex {
  /**
   * Creates a database connection using the provided configuration.
   * @param {DBConfig} config - The configuration object for the database connection.
   * @returns {Promise<void>} A promise that resolves once the connection is established.
   */
  createConnection(config: DBConfig): Promise<void>;

  /**
   * Getter method that returns the Knex SchemaBuilder associated with the connection.
   * @returns {Knex.SchemaBuilder} The Knex SchemaBuilder object for the connection.
   */
  get schemaBuilder(): Knex.SchemaBuilder;
  /**
   * Builds a query using Knex for the specified table name and options.
   * @param {Knex.TableDescriptor | Knex.AliasDict | undefined} tableName - The name of the table or an alias dictionary.
   * @param {object} [options] - Additional options for the query, such as 'only'.
   * @returns {Knex.QueryBuilder} A Knex query builder object.
   */
  queryBuilder<TRecord extends {} = any, TResult = any[]>(
    tableName?: Knex.TableDescriptor | Knex.AliasDict | undefined,
    options?:
      | {
          only?: boolean;
        }
      | undefined
  ): Knex.QueryBuilder;

  /**
   * Builds a raw Knex query using the provided value and optional binding.
   * @param {Knex.Value} value - The value to be used in the raw query.
   * @returns {Knex.Raw<any>} A raw Knex query object.
   */
  rawBuilder(value: Knex.Value): Knex.Raw<any>;

  /**
   * Builds a raw Knex query using the provided value and optional binding.
   * @param {Knex.Value} value - The value to be used in the raw query.
   * @param {Knex.RawBinding} [binding] - Optional binding for the raw query.
   * @returns {Knex.Raw<any>} A raw Knex query object.
   */
  rawBuilder(value: Knex.Value, binding?: Knex.RawBinding): Knex.Raw<any>;

  /**
   * Builds a raw Knex query using the provided value and optional binding.
   * @param {string} sql - The value or string to be used in the raw query.
   * @param {Knex.RawBinding} [bindings] - Optional binding for the raw query.
   * @returns {Knex.Raw<any>} A raw Knex query object.
   */
  rawBuilder(
    sql: string,
    bindings: readonly Knex.RawBinding[] | Knex.ValueDict
  ): Knex.Raw<any>;

  /**
   * Builds a reference to a column in a table using the provided value.
   * @param {string} value - The value to build the reference with.
   * @returns A reference to a column in a table.
   */
  refBuilder(value: string): knex.Knex.Ref<string, { [x: string]: string }>;

  /**
   * Get the Knex FunctionHelper from the connection object.
   * @returns {Knex.FunctionHelper} The Knex FunctionHelper object.
   */
  get functionHelper(): Knex.FunctionHelper;

  /**
   * Get the instance of Knex for performing database operations.
   * @returns The instance of Knex for database operations.
   */
  get knex(): typeof knex;

  /**
   * Asynchronously lists tables based on the dialect of the database client.
   * @returns A Promise that resolves to an array of strings representing table names.
   * @throws {Error} If the dialect is not supported.
   */
  listTables(): Promise<string[]>;

  /**
   * Asynchronously retrieves column information for a given table name using the query builder.
   * @param {string} name - The name of the table to retrieve column information for.
   * @returns {Promise<any>} A promise that resolves with the column information.
   */
  getColumnInfo(name: string): Promise<any>;

  /**
   * Get the database client type based on the connection configuration.
   * @returns {KnexDB_Driver} The database client type (MYSQL, PGSQL, SQLite, or the actual client type).
   */
  get client(): KnexDB_Driver;
}

/**
 * Defines a custom type for specifying the driver type for Knex database connections.
 * The driver can be one of the following: "MYSQL", "PGSQL", or "SQLite".
 */
export type KnexDB_Driver = "MYSQL" | "PGSQL" | "SQLite";

/**
 * Interface for the database configuration, extending the Knex.Config interface.
 * @property {string} client - The type of database client to be used, can be "mysql", "pg", "sqlite3", or a custom client type.
 */
export interface DBConfig extends Knex.Config {
  client?: "mysql" | "pg" | "sqlite3" | typeof Client;
}

/**
 * Defines the possible types for a database table column.
 * It can be one of the following types: "string", "integer", "boolean", "json", "datetime".
 */
export type DatabaseTableTypes =
  | "string"
  | "integer"
  | "boolean"
  | "json"
  | "datetime";

/**
 * Represents the possible types for a database table alias.
 * Can be one of: "Text", "Number", "Boolean", "Json", "Date".
 */
export type DatabaseTableAlias =
  | "Text"
  | "Number"
  | "Boolean"
  | "Json"
  | "Date";

/**
 * Interface representing the information of a column in a database table.
 * @interface DatabaseColumnInfo
 * @property {string} name - The name of the column.
 * @property {DatabaseTableTypes} type - The type of the column.
 * @property {DatabaseTableAlias} alias - The alias of the column.
 * @property {Object} actualData - Additional data related to the column.
 * @property {DatabaseTableTypes} [actualData.type] - The type of the column's actual data.
 * @property {DatabaseCreateEditModel} [actualData.columnData] - The data model for creating/editing the column.
 */
export interface DatabaseColumnInfo {
  name: string;
  type: DatabaseTableTypes;
  alias: DatabaseTableAlias;
  actualData?: {
    type?: DatabaseTableTypes;
    columnData?: DatabaseCreateEditModel;
  };
}

/**
 * Interface for defining the structure of a database create or edit model.
 * @interface DatabaseCreateEditModel
 * @property {string} columnName - The name of the column in the database.
 * @property {"varchar" | "text" | null} textFormat - The text format of the column.
 * @property {"int" | "bigInt" | "dec" | "float" | null} numberFormat - The number format of the column.
 * @property {"date" | "time" | "datetime" | null} dateTimeFormat - The date and time format of the column.
 * @property {any} defaultValue - The default value for the column.
 * @property {boolean} notNull - Indicates if
 */
export interface DatabaseCreateEditModel {
  columnName: string;
  textFormat: "varchar" | "text" | null;
  numberFormat: "int" | "bigInt" | "dec" | "float" | null;
  dateTimeFormat: "date" | "time" | "datetime" | null;
  defaultValue: any;
  notNull: boolean;
}
