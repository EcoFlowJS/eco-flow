import { DriverKnex as IDriverKnex, DBConfig } from "@eco-flow/types";
import knex, { Knex } from "knex";

export type { Knex } from "knex";

export class DriverKnex implements IDriverKnex {
  private connection!: Knex<any, any[]>;

  createConnection(config: DBConfig) {
    this.connection = knex(config);
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

  get rawBuilder(): Knex.RawBuilder {
    return this.connection.raw;
  }

  get refBuilder(): Knex.RefBuilder {
    return this.connection.ref;
  }

  get functionHelper(): Knex.FunctionHelper {
    return this.connection.fn;
  }

  get knex(): typeof knex {
    return knex;
  }
}
