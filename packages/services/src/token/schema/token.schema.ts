import { Knex, Tokens } from "@ecoflow/types";
import { Schema } from "mongoose";

/**
 * Mongoose schema for storing tokens associated with a user.
 * @param {Schema<Tokens>} - The schema definition for tokens.
 * @returns None
 */
const TokenSchemaMongoose = new Schema<Tokens>(
  {
    userId: String,
    token: String,
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    expires_at: {
      type: Date,
      default: new Date().setDate(new Date().getDate() + 7),
    },
  },
  { versionKey: false }
);

/**
 * Defines the schema for the token table using Knex.
 * @param {Knex.TableBuilder} table - The Knex TableBuilder object to define the schema on.
 * @returns None
 */
const TokenSchemaKnex = (table: Knex.TableBuilder) => {
  table.increments();
  table.string("userId");
  table.string("token");
  table.datetime("expires_at");
  table.timestamps(true, true);
};

export { TokenSchemaMongoose, TokenSchemaKnex };
