import {
  DriverKnex,
  DriverMongoose,
  FlowEditorSettingsConfigurations,
  Knex,
} from "@ecoflow/types";
import mongoose, { Model } from "mongoose";
import {
  knexFlowEditorSettingsSchema,
  mongooseFlowEditorSettingsSchema,
} from "../schema/flowSettingsSchema";
export const flowEditorSettingsModelMongoose = <
  T extends Partial<FlowEditorSettingsConfigurations> & {
    _id?: string;
    username?: string;
  }
>(
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
  if (connection.getConnection.models.flowEditorSettings)
    return connection.getConnection.model<T>("flowEditorSettings");
  else
    return connection.buildModel<T>("flowEditorSettings", {
      definition: mongooseFlowEditorSettingsSchema,
    });
};

export const flowEditorSettingsModelKnex = async <
  TRecord extends {} = Partial<FlowEditorSettingsConfigurations> & {
    _id?: string;
    username?: string;
  },
  TResult = (Partial<FlowEditorSettingsConfigurations> & {
    _id?: string;
    username?: string;
  })[]
>(
  connection: DriverKnex
): Promise<() => Knex.QueryBuilder<TRecord, TResult>> => {
  if (!(await connection.schemaBuilder.hasTable("flowEditorSettings")))
    await connection.schemaBuilder.createTable(
      "flowEditorSettings",
      knexFlowEditorSettingsSchema
    );

  return () => connection.queryBuilder<TRecord, TResult>("flowEditorSettings");
};
