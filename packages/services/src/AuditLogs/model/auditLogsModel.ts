import {
  AuditLogSchemaStruct,
  DriverKnex,
  DriverMongoose,
  Knex,
} from "@ecoflow/types";
import { Model, Document } from "mongoose";
import {
  auditLogSchemaKnex,
  auditLogSchemaMongoose,
} from "../schema/auditLogSchema.js";

/**
 * Creates or retrieves the Mongoose model for audit logs based on the provided connection.
 * @param {DriverMongoose} connection - The Mongoose driver connection.
 * @returns {Model<AuditLogSchemaStruct, {}, {}, {}, Document<unknown, {}, AuditLogSchemaStruct> & AuditLogSchemaStruct & Required<{ _id: string; }>, any>} The Mongoose model for audit logs.
 */
const auditLogsModelMongoose = (
  connection: DriverMongoose
): Model<
  AuditLogSchemaStruct,
  {},
  {},
  {},
  Document<unknown, {}, AuditLogSchemaStruct> &
    AuditLogSchemaStruct &
    Required<{
      _id: string;
    }>,
  any
> => {
  if (connection.getConnection.models.auditLogs)
    return connection.getConnection.model<AuditLogSchemaStruct>("auditLogs");
  else
    return connection.buildModel<AuditLogSchemaStruct>("auditLogs", {
      definition: auditLogSchemaMongoose,
    });
};

/**
 * Creates an audit logs model using Knex for the given database connection.
 * If the "auditLogs" table does not exist, it creates the table using the provided schema.
 * @param {DriverKnex} connection - The Knex database connection.
 * @returns A function that returns a Knex QueryBuilder for the "auditLogs" table.
 */
const auditLogsModelKnex = async (
  connection: DriverKnex
): Promise<() => Knex.QueryBuilder<AuditLogSchemaStruct, any[]>> => {
  if (!(await connection.schemaBuilder.hasTable("auditLogs"))) {
    await connection.schemaBuilder.hasTable("auditLogs");
    await connection.schemaBuilder.createTable("auditLogs", auditLogSchemaKnex);
  }

  return () => connection.queryBuilder<AuditLogSchemaStruct>("auditLogs");
};

export { auditLogsModelMongoose, auditLogsModelKnex };
