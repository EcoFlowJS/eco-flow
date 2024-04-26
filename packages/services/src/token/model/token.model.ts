import { DriverKnex, DriverMongoose, Knex, Tokens } from "@ecoflow/types";
import { Model, Document } from "mongoose";
import { TokenSchemaKnex, TokenSchemaMongoose } from "../schema/token.schema";

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

const tokenModelKnex = (connection: DriverKnex) =>
  connection.queryBuilder("tokens");

const TokenModelKnex = async (
  connection: DriverKnex
): Promise<() => Knex.QueryBuilder<Tokens, any[]>> => {
  if (!(await connection.schemaBuilder.hasTable("tokens")))
    await connection.schemaBuilder.createTable("tokens", TokenSchemaKnex);

  return () => connection.queryBuilder<Tokens>("tokens");
};

export { TokenModelMongoose, TokenModelKnex };
