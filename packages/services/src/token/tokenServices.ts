import {
  Database,
  DatabaseConnection,
  DriverKnex,
  TokenServices as ITokenServices,
} from "@eco-flow/types";
import { tokenModelKnex, tokenModelMongoose } from "./model/token.model";
import knexSeed from "./seed/knex.seed";
import Helper from "@eco-flow/helper";

export class TokenServices implements ITokenServices {
  private dataBase: Database;
  private connection: DatabaseConnection;

  constructor() {
    this.dataBase = ecoFlow.database;
    this.connection = this.dataBase.getDatabaseConnection("_sysDB");
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

  private async setToken(
    token: string,
    userId: string,
    expireIn: Date | number
  ): Promise<void> {
    if (this.dataBase.isMongoose(this.connection)) {
      if (
        (await tokenModelMongoose(this.connection).countDocuments({
          userId: userId,
        })) === 0
      )
        await new (tokenModelMongoose(this.connection))({
          token: token,
          userId: userId,
          expires_at: expireIn,
        }).save();
      else
        await tokenModelMongoose(this.connection).updateOne(
          { userId: userId },
          {
            token: token,
            userId: userId,
            expires_at: expireIn,
          }
        );
    }

    if (this.dataBase.isKnex(this.connection)) {
      if (!(await this.connection.schemaBuilder.hasTable("tokens")))
        await knexSeed(this.connection);

      if (
        (
          await tokenModelKnex(this.connection)
            .count()
            .where({ userId: userId })
        )[0]["count(*)"] === 0
      )
        await tokenModelKnex(this.connection).insert({
          userId: userId,
          token: token,
          expires_at: expireIn,
        });
      else
        await tokenModelKnex(this.connection)
          .update({
            userId: userId,
            token: token,
            expires_at: expireIn,
          })
          .where({ userId: userId });
    }
  }

  async generateToken(_id: string): Promise<[string, string, number]> {
    const access_token_expires_at = new Date().setHours(
      new Date().getHours() + 1
    );
    const refresh_token_expires_at = new Date().setDate(
      new Date().getDate() + 7
    );

    const access_token = await Helper.generateJwtToken(
      { _id: _id },
      { expiresIn: access_token_expires_at }
    );
    const refresh_token = await Helper.generateJwtToken(
      { _id: _id },
      { expiresIn: refresh_token_expires_at }
    );

    await this.setToken(refresh_token, _id, refresh_token_expires_at);

    return [access_token, refresh_token, refresh_token_expires_at];
  }
}
