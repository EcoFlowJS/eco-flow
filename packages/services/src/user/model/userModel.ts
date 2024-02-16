import {
  DriverKnex,
  DriverMongoose,
  Knex,
  userTableCollection,
} from "@eco-flow/types";
import { knexSchema, mongooseSchema } from "../schema/userSchema";
import { Model } from "mongoose";
export const userModelMongoose = (
  connection: DriverMongoose
): Model<any, unknown, unknown, {}, any, any> => {
  if (connection.getConnection.models.users)
    return connection.getConnection.model("users");
  else return connection.buildModel("users", { definition: mongooseSchema });
};

export const userModelKnex = async (
  connection: DriverKnex
): Promise<() => Knex.QueryBuilder<any, any>> => {
  if (!(await connection.schemaBuilder.hasTable("users")))
    await connection.schemaBuilder.createTable("users", knexSchema);

  return () => connection.queryBuilder<userTableCollection>("users");
};
