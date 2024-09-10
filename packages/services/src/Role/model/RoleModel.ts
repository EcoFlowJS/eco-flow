import { DriverKnex, DriverMongoose, Knex, Role } from "@ecoflow/types";
import mongoose, { Model } from "mongoose";
import { RoleSchemaKnex, RoleSchemaMongoose } from "../schema/RoleSchema.js";

/**
 * Creates a Mongoose model for the Role schema using the provided Mongoose connection.
 * @param {DriverMongoose} connection - The Mongoose connection to use for creating the model.
 * @returns {Model<Role, {}, {}, {}, mongoose.Document<unknown, {}, Role> & Role & Required<{ _id: string; }>, any>}
 * A Mongoose model for the Role schema.
 */
const RoleModelMongoose = (
  connection: DriverMongoose
): Model<
  Role,
  {},
  {},
  {},
  mongoose.Document<unknown, {}, Role> &
    Role &
    Required<{
      _id: string;
    }>,
  any
> => {
  if (connection.getConnection.models.roles)
    return connection.getConnection.model<Role>("roles");
  else
    return connection.buildModel<Role>("roles", {
      definition: RoleSchemaMongoose,
    });
};

/**
 * Asynchronously creates a RoleModelKnex function that returns a Knex QueryBuilder for the 'roles' table.
 * If the 'roles' table does not exist, it creates the table using RoleSchemaKnex.
 * @param {DriverKnex} connection - The Knex connection object.
 * @returns A Promise that resolves to a function returning a Knex QueryBuilder for the 'roles' table.
 */
const RoleModelKnex = async (
  connection: DriverKnex
): Promise<() => Knex.QueryBuilder<Role, any[]>> => {
  if (!(await connection.schemaBuilder.hasTable("roles")))
    await connection.schemaBuilder.createTable("roles", RoleSchemaKnex);

  return () => connection.queryBuilder<Role>("roles");
};

export { RoleModelMongoose, RoleModelKnex };
