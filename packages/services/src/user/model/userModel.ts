import {
  DriverKnex,
  DriverMongoose,
  Knex,
  userTableCollection,
} from "@ecoflow/types";
import { knexSchema, mongooseSchema } from "../schema/userSchema";
import mongoose, { Model } from "mongoose";
export const userModelMongoose = <T extends userTableCollection>(
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

export const userModelKnex = async <
  TRecord extends {} = userTableCollection,
  TResult = userTableCollection[]
>(
  connection: DriverKnex
): Promise<() => Knex.QueryBuilder<TRecord, TResult>> => {
  if (!(await connection.schemaBuilder.hasTable("users")))
    await connection.schemaBuilder.createTable("users", knexSchema);

  return () => connection.queryBuilder<TRecord, TResult>("users");
};
