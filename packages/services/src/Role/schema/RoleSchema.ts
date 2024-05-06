import { Role, Knex } from "@ecoflow/types";
import { Schema } from "mongoose";

/**
 * Represents the Mongoose schema for a Role entity.
 * @param {Object} Role - The Role entity object.
 * @returns A Mongoose schema for the Role entity.
 */
const RoleSchemaMongoose = new Schema<Role>(
  {
    name: String,
    isDefault: {
      type: Boolean,
      default: false,
    },
    permissions: Object,
  },
  { versionKey: false }
);

/**
 * Defines the schema for the Role table using Knex.
 * @param {Knex.TableBuilder} table - The Knex TableBuilder object to define the schema on.
 * @returns None
 */
const RoleSchemaKnex = (table: Knex.TableBuilder) => {
  table.increments("_id");
  table.string("name");
  table.boolean("isDefault").defaultTo(false);
  table.json("permissions");
};

export { RoleSchemaMongoose, RoleSchemaKnex };
