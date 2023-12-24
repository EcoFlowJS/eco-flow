import path from "path";
import { Helper } from "@eco-flow/helper";
import { DriverKnex as IDriverKnex, DBConfig } from "@eco-flow/types";
import knex, { Knex } from "knex";

export type { Knex } from "knex";

export class DriverKnex implements IDriverKnex {
  private connection!: Knex<any, any[]>;

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
}
