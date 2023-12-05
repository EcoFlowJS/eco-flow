import path from "path";
import { Helper } from "@eco-flow/helper";
import { DriverKnex as IDriverKnex, DBConfig } from "@eco-flow/types";
import knex, { Knex } from "knex";

export type { Knex } from "knex";

export class DriverKnex implements IDriverKnex {
  private connection!: Knex<any, any[]>;

  private async installDriverKnex(driver: DBConfig["client"]): Promise<void> {
    await Helper.installPackageHelper(
      ecoFlow.config._config.DB_DriverDir!,
      driver!.toString()
    );
  }

  private async driverinit(driver: DBConfig["client"]): Promise<void> {
    try {
      ecoFlow.log.info("initializing Knex driver " + driver);
      const packageModulePath = path.join(
        ecoFlow.config._config.DB_DriverDir!,
        "node_modules"
      );
      require(`${packageModulePath}/${driver}`);
    } catch {
      ecoFlow.log.info(
        "Database Driver is not installed... Installing it please wait..."
      );
      await this.installDriverKnex(driver);
      await this.initDBClientDriver({ client: driver });
    }
  }

  private async initDBClientDriver({ client }: DBConfig): Promise<void> {
    switch (client) {
      case "mysql":
        this.driverinit("mysql");
        break;

      case "pg":
        this.driverinit("pg");
        break;

      case "sqlite3":
        this.driverinit("sqlite3");
        break;

      default:
        break;
    }
  }

  async createConnection(config: DBConfig) {
    await this.initDBClientDriver(config);
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
