import {
  Database,
  DatabaseConnection,
  TokenServices as ITokenServices,
  Tokens,
} from "@ecoflow/types";
import Helper from "@ecoflow/helper";
import { TokenModelKnex, TokenModelMongoose } from "./model/token.model";
import { Database as EcoDB } from "@ecoflow/database";

export class TokenServices implements ITokenServices {
  private dataBase: Database;
  private connection: DatabaseConnection;

  constructor(conn?: DatabaseConnection) {
    this.dataBase = ecoFlow.database;
    this.connection = conn || this.dataBase.getDatabaseConnection("_sysDB");
  }

  private async setToken(
    token: string,
    userId: string,
    expireIn: Date | number
  ): Promise<void> {
    const { _ } = ecoFlow;
    userId = userId.toLowerCase();
    if (this.dataBase.isMongoose(this.connection)) {
      if (
        (await TokenModelMongoose(this.connection).countDocuments({
          userId: userId,
        })) === 0
      )
        await new (TokenModelMongoose(this.connection))({
          token: token,
          userId: userId,
          expires_at: expireIn,
        }).save();
      else
        await TokenModelMongoose(this.connection).updateOne(
          { userId: userId },
          {
            token: token,
            userId: userId,
            expires_at: expireIn,
          }
        );
    }

    if (this.dataBase.isKnex(this.connection)) {
      const countQuery = (
        await (await TokenModelKnex(this.connection))()
          .count()
          .where({ userId: userId })
      )[0] as any;
      const count = !_.isUndefined(countQuery["count(*)"])
        ? countQuery["count(*)"]
        : countQuery.count;
      if (Number(count) === 0)
        await (
          await TokenModelKnex(this.connection)
        )().insert({
          userId: userId,
          token: token,
          expires_at: EcoDB.formatKnexDateTime(
            _.isDate(expireIn) ? expireIn : new Date(expireIn)
          ) as any,
        });
      else
        await (
          await TokenModelKnex(this.connection)
        )()
          .update({
            userId: userId,
            token: token,
            expires_at: EcoDB.formatKnexDateTime(
              _.isDate(expireIn) ? expireIn : new Date(expireIn)
            ) as any,
          })
          .where({ userId: userId });
    }
  }

  async getAllTokens(): Promise<Tokens[]> {
    if (this.dataBase.isKnex(this.connection))
      return await (await TokenModelKnex(this.connection))().select();

    if (this.dataBase.isMongoose(this.connection))
      return await TokenModelMongoose(this.connection).find();

    throw "Invalid database connection specified";
  }

  async checkToken(token: string, userId: string): Promise<boolean> {
    const { _ } = ecoFlow;
    userId = userId.toLowerCase();
    let result = false;
    if (this.dataBase.isMongoose(this.connection)) {
      if (
        (await TokenModelMongoose(this.connection).countDocuments({
          userId: userId,
          token: token,
          expires_at: { $gt: new Date() },
        })) > 0
      )
        result = true;
    }
    if (this.dataBase.isKnex(this.connection)) {
      const fetchQuery = (await TokenModelKnex(this.connection))().where({
        userId: userId,
        token: token,
      });

      this.connection.client === "PGSQL"
        ? fetchQuery.whereRaw(
            this.connection.rawBuilder("expires_at >= ?", "now()")
          )
        : fetchQuery.where("expires_at", ">=", Date.now());

      const countQuery = (await fetchQuery.count())[0] as any;

      const count = !_.isUndefined(countQuery["count(*)"])
        ? countQuery["count(*)"]
        : countQuery.count;
      if (Number(count) > 0) result = true;
    }
    return result;
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

  async removeToken(token: string, userId: string): Promise<void> {
    if (this.dataBase.isMongoose(this.connection))
      await TokenModelMongoose(this.connection).deleteOne({ token, userId });

    if (this.dataBase.isKnex(this.connection))
      await (await TokenModelKnex(this.connection))()
        .delete()
        .where({ token, userId });
  }

  async migrateToken(token: Tokens): Promise<void> {
    if (this.dataBase.isMongoose(this.connection)) {
      await TokenModelMongoose(this.connection).create(token);
      return;
    }

    if (this.dataBase.isKnex(this.connection)) {
      await (await TokenModelKnex(this.connection))().insert(token);
      return;
    }

    throw "Invalid database connection specified";
  }
}
