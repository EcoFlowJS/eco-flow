import { DriverKnex as IDriverKnex, DBConfig } from "@eco-flow/types";
import knex, { Knex } from "knex";

export type { Knex } from "knex";

export class DriverKnex implements IDriverKnex {
  private connection!: Knex<any, any[]>;

  private getMySqlListProp(resp: any[]) {
    let vals = resp[0];
    if (!vals) return;
    return Object.keys(vals && vals[0])[0];
  }

  private getMySqlReturnValues(resp: any[]) {
    let prop = this.getMySqlListProp(resp);
    return prop && resp[0].map((it: { [x: string]: any }) => it[prop!]);
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

  rawBuilder(value: Knex.Value): Knex.Raw<any> {
    return this.connection.raw(value);
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

  async listTables(): Promise<string[]> {
    let dialect = this.connection.client.config.client;
    if (["mysql", "mysql2"].indexOf(dialect) > -1)
      return this.connection.raw("show tables").then(this.getMySqlReturnValues);

    if (dialect === "postgresql")
      return this.connection
        .select("tablename") //SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'
        .from("pg_catalog.pg_tables")
        .where({ schemaname: "public" })
        .then((rst) => rst.map((it) => it.tablename));

    if (dialect === "sqlite3")
      return this.connection
        .select("name")
        .from("sqlite_master")
        .where({ type: "table" })
        .then((rst) => {
          return rst
            .filter((it) => it.name != "sqlite_sequence")
            .map((it) => it["name"]);
        });
    else throw new Error(`${dialect} not supported`);
  }
}
