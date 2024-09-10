import { DriverKnex, DriverMongoose, Knex, Tokens } from "@ecoflow/types";
import { Model, Document } from "mongoose";
import {
  TokenSchemaKnex,
  TokenSchemaMongoose,
} from "../schema/token.schema.js";

/**
 * Creates a Mongoose model for the Tokens collection based on the provided Mongoose connection.
 * @param {DriverMongoose} connection - The Mongoose connection object.
 * @returns {Model} A Mongoose model for the Tokens collection.
 */
const TokenModelMongoose = (
  connection: DriverMongoose
): Model<
  Tokens,
  {},
  {},
  {},
  Document<unknown, {}, Tokens> &
    Tokens & {
      _id: string;
    },
  any
> => {
  if (connection.getConnection.models.tokens)
    return connection.getConnection.model<Tokens>("tokens");
  else
    return connection.buildModel<Tokens>("tokens", {
      definition: TokenSchemaMongoose,
    });
};

/**
 * Creates a TokenModelKnex function that returns a query builder for the 'tokens' table.
 * @param {DriverKnex} connection - The Knex connection object.
 * @returns A promise that resolves to a function returning a query builder for the 'tokens' table.
 */
const TokenModelKnex = async (
  connection: DriverKnex
): Promise<() => Knex.QueryBuilder<Tokens, any[]>> => {
  if (!(await connection.schemaBuilder.hasTable("tokens")))
    await connection.schemaBuilder.createTable("tokens", TokenSchemaKnex);

  return () => connection.queryBuilder<Tokens>("tokens");
};

export { TokenModelMongoose, TokenModelKnex };
