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
  rawBuilder(value: Knex.Value): Knex.Raw<any>;
  refBuilder(value: string): knex.Knex.Ref<string, { [x: string]: string }>;
  get functionHelper(): Knex.FunctionHelper;
  get knex(): typeof knex;
}

export interface DBConfig extends Knex.Config {
  client?: "mysql" | "pg" | "sqlite3" | typeof Client;
}
