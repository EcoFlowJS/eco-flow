import knex, { Client, Knex } from "knex";

export type { Knex } from "knex";

export interface DriverKnex {
  createConnection: (config: DBConfig) => void;
  get schemaBuilder(): Knex.SchemaBuilder;
  queryBuilder<TRecord extends {} = any, TResult = any[]>(
    tableName?: Knex.TableDescriptor | Knex.AliasDict | undefined,
    options?:
      | {
          only?: boolean;
        }
      | undefined
  ): Knex.QueryBuilder;
  get rawBuilder(): Knex.RawBuilder;
  get refBuilder(): Knex.RefBuilder;
  get functionHelper(): Knex.FunctionHelper;
  get knex(): typeof knex;
}

export interface DBConfig extends Knex.Config {
  client?: "mysql" | "pg" | "sqlite3" | "mssql" | typeof Client;
}
