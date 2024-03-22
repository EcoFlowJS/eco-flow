import {
  AuditLogSchemaStruct,
  DriverKnex,
  DriverMongoose,
  Knex,
} from "@eco-flow/types";
import { Model, Document } from "mongoose";
import {
  auditLogSchemaKnex,
  auditLogSchemaMongoose,
} from "../schema/auditLogSchema";

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

const auditLogsModelKnex = async (
  connection: DriverKnex
): Promise<() => Knex.QueryBuilder<AuditLogSchemaStruct, any[]>> => {
  if (!(await connection.schemaBuilder.hasTable("auditLogs")))
    await connection.schemaBuilder.createTable("auditLogs", auditLogSchemaKnex);

  return () => connection.queryBuilder<AuditLogSchemaStruct>("auditLogs");
};

export { auditLogsModelMongoose, auditLogsModelKnex };
