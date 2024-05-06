import {
  DriverKnex as IDriverKnex,
  DBConfig,
  KnexDB_Driver,
} from "@ecoflow/types";
import knex, { Knex } from "knex";

/**
 * Represents a class that implements the DriverKnex interface for interacting with a database using Knex.js.
 */
export class DriverKnex implements IDriverKnex {
  private connection!: Knex<any, any[]>;

  /**
   * Retrieves a property from a MySQL response array.
   * @param {any[]} resp - The MySQL response array.
   * @returns The property value extracted from the response.
   */
  private getMySqlListProp(resp: any[]) {
    const { _ } = ecoFlow;
    const vals = resp[0];
    if (_.isEmpty(vals)) return;
    return Object.keys(vals && vals[0])[0];
  }

  /**
   * Retrieves the MySQL return values from the response array.
   * @param {any[]} resp - The response array from MySQL query.
   * @returns {any[]} - An array of MySQL return values sorted in ascending order.
   */
  private getMySqlReturnValues(resp: any[]) {
    const prop = this.getMySqlListProp(resp);
    if (typeof prop === "undefined") return [];
    return prop && resp[0].map((it: { [x: string]: any }) => it[prop!]).sort();
  }

  /**
   * Creates a database connection using the provided configuration.
   * @param {DBConfig} config - The configuration object for the database connection.
   * @returns {Promise<void>} A promise that resolves once the connection is established.
   */
  async createConnection(config: DBConfig): Promise<void> {
    this.connection = await knex(config);
  }

  /**
   * Getter method that returns the Knex SchemaBuilder associated with the connection.
   * @returns {Knex.SchemaBuilder} The Knex SchemaBuilder object for the connection.
   */
  get schemaBuilder(): Knex.SchemaBuilder {
    return this.connection.schema;
  }

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
  ): Knex.QueryBuilder {
    return this.connection<TRecord, TResult>(tableName, options);
  }

  /**
   * Builds a raw Knex query using the provided value and optional binding.
   * @param {Knex.Value | string} value - The value or string to be used in the raw query.
   * @param {Knex.RawBinding} [binding] - Optional binding for the raw query.
   * @returns {Knex.Raw<any>} A raw Knex query object.
   */
  rawBuilder(
    value: Knex.Value | string,
    binding?: Knex.RawBinding
  ): Knex.Raw<any> {
    return this.connection.raw(value as any, binding as any);
  }

  /**
   * Builds a reference to a column in a table using the provided value.
   * @param {string} value - The value to build the reference with.
   * @returns A reference to a column in a table.
   */
  refBuilder(value: string): knex.Knex.Ref<string, { [x: string]: string }> {
    return this.connection.ref(value);
  }

  /**
   * Get the Knex FunctionHelper from the connection object.
   * @returns {Knex.FunctionHelper} The Knex FunctionHelper object.
   */
  get functionHelper(): Knex.FunctionHelper {
    return this.connection.fn;
  }

  /**
   * Get the instance of Knex for performing database operations.
   * @returns The instance of Knex for database operations.
   */
  get knex(): typeof knex {
    return knex;
  }

  /**
   * Get the database client type based on the connection configuration.
   * @returns {KnexDB_Driver} The database client type (MYSQL, PGSQL, SQLite, or the actual client type).
   */
  get client(): KnexDB_Driver {
    const client = this.connection.client.config.client;
    if (["mysql", "mysql2"].indexOf(client) > -1) return "MYSQL";
    if (client === "pg") return "PGSQL";
    if (client === "sqlite3") return "SQLite";
    return client;
  }

  /**
   * Asynchronously lists tables based on the dialect of the database client.
   * @returns A Promise that resolves to an array of strings representing table names.
   * @throws {Error} If the dialect is not supported.
   */
  async listTables(): Promise<string[]> {
    const dialect = this.client;

    /**
     * Executes a MySQL query to show tables and returns the result.
     * @param {string} dialect - The SQL dialect to use (e.g., "MYSQL").
     * @returns A Promise that resolves with the result of the query.
     */
    if (dialect === "MYSQL")
      return this.connection
        .raw("show tables")
        .then((value) => this.getMySqlReturnValues(value));

    /**
     * Retrieves table names from the specified PostgreSQL schema.
     * @param {string} dialect - The SQL dialect to use (e.g., "PGSQL").
     * @returns {Promise<string[]>} A promise that resolves to an array of table names sorted alphabetically.
     */
    if (dialect === "PGSQL")
      return this.connection
        .select("tablename") //SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'
        .from("pg_catalog.pg_tables")
        .where({ schemaname: "public" })
        .then((rst) => rst.map((it) => it.tablename).sort());

    /**
     * Retrieves a list of table names from the SQLite database.
     * @param {string} dialect - The SQL dialect being used (e.g., "SQLite").
     * @returns A Promise that resolves to an array of table names sorted alphabetically.
     */
    if (dialect === "SQLite")
      return this.connection
        .select("name")
        .from("sqlite_master")
        .where({ type: "table" })
        .then((rst) => {
          return rst
            .filter((it) => it.name != "sqlite_sequence")
            .map((it) => it["name"])
            .sort();
        });
    else throw new Error(`${dialect} not supported`);
  }

  /**
   * Asynchronously retrieves column information for a given table name using the query builder.
   * @param {string} name - The name of the table to retrieve column information for.
   * @returns {Promise<any>} A promise that resolves with the column information.
   */
  async getColumnInfo(name: string): Promise<any> {
    return await this.queryBuilder(name).columnInfo();
  }
}
