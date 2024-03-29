import { DriverKnex, DriverMongoose, Knex, Role } from "@ecoflow/types";
import mongoose, { Model } from "mongoose";
import { RoleSchemaKnex, RoleSchemaMongoose } from "../schema/RoleSchema";

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

const RoleModelKnex = async (
  connection: DriverKnex
): Promise<() => Knex.QueryBuilder<Role, any[]>> => {
  if (!(await connection.schemaBuilder.hasTable("roles")))
    await connection.schemaBuilder.createTable("roles", RoleSchemaKnex);

  return () => connection.queryBuilder<Role>("roles");
};

export { RoleModelMongoose, RoleModelKnex };
