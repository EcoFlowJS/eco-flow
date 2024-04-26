import {
  DriverKnex as IDriverKnex,
  DBConfig,
  KnexDB_Driver,
} from "@ecoflow/types";
import knex, { Knex } from "knex";

export type { Knex } from "knex";

export class DriverKnex implements IDriverKnex {
  private connection!: Knex<any, any[]>;

  private getMySqlListProp(resp: any[]) {
    const { _ } = ecoFlow;
    const vals = resp[0];
    if (_.isEmpty(vals)) return;
    return Object.keys(vals && vals[0])[0];
  }

  private getMySqlReturnValues(resp: any[]) {
    const prop = this.getMySqlListProp(resp);
    if (typeof prop === "undefined") return [];
    return prop && resp[0].map((it: { [x: string]: any }) => it[prop!]).sort();
  }

  async createConnection(config: DBConfig) {
    this.connection = await knex(config);
  }

  get schemaBuilder(): Knex.SchemaBuilder {
    return this.connection.schema;
  }

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

  rawBuilder(
    value: Knex.Value | string,
    binding?: Knex.RawBinding
  ): Knex.Raw<any> {
    return this.connection.raw(value as any, binding as any);
  }

  refBuilder(value: string): knex.Knex.Ref<string, { [x: string]: string }> {
    return this.connection.ref(value);
  }

  get functionHelper(): Knex.FunctionHelper {
    return this.connection.fn;
  }

  get knex(): typeof knex {
    return knex;
  }

  get client(): KnexDB_Driver {
    const client = this.connection.client.config.client;
    if (["mysql", "mysql2"].indexOf(client) > -1) return "MYSQL";
    if (client === "pg") return "PGSQL";
    if (client === "sqlite3") return "SQLite";
    return client;
  }

  async listTables(): Promise<string[]> {
    const dialect = this.client;
    if (dialect === "MYSQL")
      return this.connection
        .raw("show tables")
        .then((value) => this.getMySqlReturnValues(value));

    if (dialect === "PGSQL")
      return this.connection
        .select("tablename") //SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'
        .from("pg_catalog.pg_tables")
        .where({ schemaname: "public" })
        .then((rst) => rst.map((it) => it.tablename).sort());

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

  async getColumnInfo(name: string): Promise<any> {
    return await this.queryBuilder(name).columnInfo();
  }
}
