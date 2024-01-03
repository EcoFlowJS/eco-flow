import {
  Database,
  DatabaseConnection,
  DriverKnex,
  TokenServices as ITokenServices,
} from "@eco-flow/types";
import { tokenModelKnex, tokenModelMongoose } from "./model/token.model";
import knexSeed from "./seed/knex.seed";

export class TokenServices implements ITokenServices {
  private dataBase: Database;
  private connection: DatabaseConnection;

  constructor() {
    this.dataBase = ecoFlow.database;
    this.connection = this.dataBase.getDatabaseConnection("mongo24");
  }
  async checkToken(token: string, userId: string): Promise<boolean> {
    let result = false;
    if (this.dataBase.isMongoose(this.connection)) {
      if (
        (await tokenModelMongoose(this.connection).countDocuments({
          userId: userId,
          token: token,
          expires_at: { $gt: new Date() },
        })) > 0
      )
        result = true;
    }
    if (this.dataBase.isKnex(this.connection)) {
      if (!(await this.connection.schemaBuilder.hasTable("tokens")))
        await knexSeed(this.connection);
      if (
        (
          await tokenModelKnex(this.connection)
            .where({
              userId: userId,
              token: token,
            })
            .where("created_at", ">=", Date.now())
            .count()
        )[0]["count(*)"] > 0
      )
        result = true;
    }
    return result;
  }

  async setToken(token: string, userId: string, expireIn: Date): Promise<void> {
    if (this.dataBase.isMongoose(this.connection)) {
    }

    if (this.dataBase.isKnex(this.connection)) {
    }
  }

  async updateToken(
    token: string,
    userId: string,
    expireIn: Date
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
