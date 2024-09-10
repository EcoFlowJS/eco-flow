import {
  DriverKnex,
  DriverMongoose,
  Knex,
  userTableCollection,
} from "@ecoflow/types";
import { knexSchema, mongooseSchema } from "../schema/userSchema.js";
import mongoose, { Model } from "mongoose";

/**
 * Creates a Mongoose model for the specified user table collection.
 * @param {DriverMongoose} connection - The Mongoose driver connection.
 * @returns {Model} A Mongoose model for the specified user table collection.
 */
const userModelMongoose = <T extends userTableCollection>(
  connection: DriverMongoose
): Model<
  T,
  {},
  {},
  {},
  mongoose.Document<unknown, {}, T> &
    T &
    Required<{
      _id: string;
    }>,
  any
> => {
  if (connection.getConnection.models.users)
    return connection.getConnection.model<T>("users");
  else return connection.buildModel<T>("users", { definition: mongooseSchema });
};

/**
 * Creates a Knex query builder function for the "users" table in the database.
 * @param {DriverKnex} connection - The Knex connection object.
 * @returns A promise that resolves to a function that returns a Knex query builder for the "users" table.
 */
const userModelKnex = async <
  TRecord extends {} = userTableCollection,
  TResult = userTableCollection[]
>(
  connection: DriverKnex
): Promise<() => Knex.QueryBuilder<TRecord, TResult>> => {
  if (!(await connection.schemaBuilder.hasTable("users")))
    await connection.schemaBuilder.createTable("users", knexSchema);

  return () => connection.queryBuilder<TRecord, TResult>("users");
};

export { userModelMongoose, userModelKnex };
