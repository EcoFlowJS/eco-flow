import { Knex, Tokens } from "@ecoflow/types";
import { Schema } from "mongoose";

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

const TokenSchemaKnex = (table: Knex.TableBuilder) => {
  table.increments();
  table.string("userId");
  table.string("token");
  table.datetime("expires_at");
  table.timestamps(true, true);
};

export { TokenSchemaMongoose, TokenSchemaKnex };
