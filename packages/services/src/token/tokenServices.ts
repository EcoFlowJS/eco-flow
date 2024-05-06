import {
  Database,
  DatabaseConnection,
  TokenServices as ITokenServices,
  Tokens,
} from "@ecoflow/types";
import Helper from "@ecoflow/helper";
import { TokenModelKnex, TokenModelMongoose } from "./model/token.model";
import { Database as EcoDB } from "@ecoflow/database";

/**
 * TokenServices class that implements TokenServices interface.
 * This class provides methods for managing tokens in the database.
 */
export class TokenServices implements ITokenServices {
  private dataBase: Database;
  private connection: DatabaseConnection;

  /**
   * Constructor for a class that initializes the database connection.
   * @param {DatabaseConnection} [conn] - Optional parameter for a custom database connection.
   * If not provided, a default connection to the "_sysDB" database is used.
   * @returns None
   */
  constructor(conn?: DatabaseConnection) {
    this.dataBase = ecoFlow.database;
    this.connection = conn || this.dataBase.getDatabaseConnection("_sysDB");
  }

  /**
   * Sets a token for a given user in the database with the specified expiration date.
   * @param {string} token - The token to set for the user.
   * @param {string} userId - The ID of the user for whom the token is being set.
   * @param {Date | number} expireIn - The expiration date or time in milliseconds for the token.
   * @returns {Promise<void>} A Promise that resolves when the token is successfully set in the database.
   */
  private async setToken(
    token: string,
    userId: string,
    expireIn: Date | number
  ): Promise<void> {
    const { _ } = ecoFlow;
    userId = userId.toLowerCase();
    /**
     * Checks if the connection is using Mongoose, then either inserts a new token document
     * or updates an existing token document based on the userId.
     * @param {string} userId - The user ID associated with the token.
     * @param {string} token - The token to be saved or updated.
     * @param {number} expireIn - The expiration time of the token.
     * @returns None
     */
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

    /**
     * Checks if the connection is using Knex, then performs a count query to determine if a record exists for the given userId.
     * If no record exists, it inserts a new record with the provided userId, token, and expiration date.
     * If a record exists, it updates the existing record with the new token and expiration date.
     * @param {any} userId - The user ID for which the token is associated.
     * @param {string} token - The token to be inserted or updated.
     * @param {Date | string} expireIn - The expiration date of the token.
     * @returns None
     */
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

  /**
   * Retrieves all tokens from the database based on the type of connection.
   * @returns {Promise<Tokens[]>} A promise that resolves to an array of tokens.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async getAllTokens(): Promise<Tokens[]> {
    /**
     * Checks if the connection is using Knex and returns the result of selecting all records from the TokenModel.
     * @param {any} connection - The database connection object.
     * @returns {Promise<any>} A promise that resolves to the selected records from the TokenModel.
     */
    if (this.dataBase.isKnex(this.connection))
      return await (await TokenModelKnex(this.connection))().select();

    /**
     * Checks if the connection is using Mongoose and returns all tokens from the TokenModelMongoose.
     * @param {any} connection - The database connection to check.
     * @returns {Promise<any>} - A promise that resolves to an array of tokens.
     */
    if (this.dataBase.isMongoose(this.connection))
      return await TokenModelMongoose(this.connection).find();

    throw "Invalid database connection specified";
  }

  /**
   * Asynchronously checks if a given token is valid for a specific user.
   * @param {string} token - The token to check for validity.
   * @param {string} userId - The ID of the user associated with the token.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the token is valid.
   */
  async checkToken(token: string, userId: string): Promise<boolean> {
    const { _ } = ecoFlow;
    userId = userId.toLowerCase();
    let result = false;

    /**
     * Checks if the provided token for the given user is valid and not expired.
     * @param {string} userId - The user ID for which the token is being checked.
     * @param {string} token - The token to be validated.
     * @returns {boolean} Returns true if the token is valid and not expired, false otherwise.
     */
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

    /**
     * Checks if the connection is using Knex, then fetches a query based on the userId and token.
     * If the connection is using PGSQL, it adds a whereRaw clause to check for expiration.
     * Otherwise, it adds a where clause to check for expiration based on the current date.
     * @param {string} userId - The user ID to fetch the token for.
     * @param {string} token - The token to fetch.
     * @returns {boolean} - Returns true if the count of fetched tokens is greater than 0, false otherwise.
     */
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

  /**
   * Generates access and refresh tokens for a given user ID and sets the refresh token in the database.
   * @param {string} _id - The user ID for which tokens are generated.
   * @returns A promise that resolves to an array containing the access token, refresh token, and refresh token expiration time.
   */
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

  /**
   * Removes a token associated with a specific user from the database.
   * @param {string} token - The token to be removed.
   * @param {string} userId - The ID of the user associated with the token.
   * @returns {Promise<void>} A promise that resolves once the token is successfully removed.
   */
  async removeToken(token: string, userId: string): Promise<void> {
    /**
     * Deletes a token from the TokenModelMongoose collection based on the provided token and userId.
     * @param {string} token - The token to be deleted.
     * @param {string} userId - The userId associated with the token.
     * @returns None
     */
    if (this.dataBase.isMongoose(this.connection))
      await TokenModelMongoose(this.connection).deleteOne({ token, userId });

    /**
     * Deletes a token from the database using Knex if the connection is a Knex connection.
     * @param {string} token - The token to delete from the database.
     * @param {string} userId - The user ID associated with the token.
     * @returns None
     */
    if (this.dataBase.isKnex(this.connection))
      await (await TokenModelKnex(this.connection))()
        .delete()
        .where({ token, userId });
  }

  /**
   * Migrates a token to the database based on the type of database connection.
   * @param {Tokens} token - The token object to migrate.
   * @returns {Promise<void>} A promise that resolves when the token is successfully migrated.
   * @throws {string} If an invalid database connection is specified.
   */
  async migrateToken(token: Tokens): Promise<void> {
    /**
     * Checks if the connection is a Mongoose connection, then creates a new token using the TokenModelMongoose.
     * @param {any} connection - The database connection to check.
     * @param {any} token - The token to create.
     * @returns None
     */
    if (this.dataBase.isMongoose(this.connection)) {
      await TokenModelMongoose(this.connection).create(token);
      return;
    }

    /**
     * Checks if the connection is using Knex, then inserts a token into the TokenModel.
     * @param {any} connection - The connection object to the database.
     * @param {any} token - The token to insert into the database.
     * @returns None
     */
    if (this.dataBase.isKnex(this.connection)) {
      await (await TokenModelKnex(this.connection))().insert(token);
      return;
    }

    throw "Invalid database connection specified";
  }
}
