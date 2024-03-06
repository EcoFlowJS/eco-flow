import knex, { Client, Knex } from "knex";

export type { Knex } from "knex";

export interface DriverKnex {
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
  listTables(): Promise<string[]>;
  getColumnInfo(name: string): Promise<any>;
}

export interface DBConfig extends Knex.Config {
  client?: "mysql" | "pg" | "sqlite3" | typeof Client;
}

export type DatabaseTableTypes =
  | "string"
  | "integer"
  | "boolean"
  | "json"
  | "datetime"
  | "foreign";

export type DatabaseTableAlias =
  | "Text"
  | "Number"
  | "Boolean"
  | "Json"
  | "Date"
  | "Foreign";

export interface DatabaseColumnInfo {
  name: string;
  type: DatabaseTableTypes;
  alias: string;
  actualData?: {
    type?: DatabaseTableTypes;
    columnData?: DatabaseCreateEditModel;
  };
}

export interface DatabaseCreateEditModel {
  columnName: string;
  textFormat: "varchar" | "text" | null;
  numberFormat: "int" | "bigInt" | "dec" | "float" | null;
  dateTimeFormat: "date" | "time" | "datetime" | null;
  defaultValue: any;
  notNull: boolean;
}
