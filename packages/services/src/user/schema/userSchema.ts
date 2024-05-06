import { Knex, userTableCollection } from "@ecoflow/types";
import { ObjectId, Schema } from "mongoose";

/**
 * Defines a Mongoose schema for the userTableCollection with specified fields and types.
 * @param {Object} userTableCollection - The collection object for the user table.
 * @returns A Mongoose schema for the user table collection.
 */
const mongooseSchema = new Schema<userTableCollection>(
  {
    name: String,
    username: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    roles: {
      required: true,
      type: Array<ObjectId>,
    },
    isActive: {
      required: true,
      type: Boolean,
      default: true,
    },
    email: String,
    oldPassword: String,
    isPermanent: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

/**
 * Defines the schema for a table using Knex.
 * @param {Knex.TableBuilder} table - The Knex TableBuilder object to define the schema on.
 * @returns None
 */
const knexSchema = (table: Knex.TableBuilder) => {
  table.increments("_id");
  table.string("name");
  table.string("username");
  table.json("roles");
  table.string("password");
  table.boolean("isActive").defaultTo(true);
  table.string("email");
  table.string("oldPassword");
  table.boolean("isPermanent").defaultTo(false);
  table.timestamps(true, true);
};

export { mongooseSchema, knexSchema };
