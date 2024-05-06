import { AuditLogSchemaStruct, Knex, AuditLogType } from "@ecoflow/types";
import { Schema } from "mongoose";

/**
 * Represents the Mongoose schema for an audit log entry.
 * @param {AuditLogSchemaStruct} - The structure of the audit log schema.
 * @returns A Mongoose schema object for audit log entries.
 */
const auditLogSchemaMongoose = new Schema<AuditLogSchemaStruct>(
  {
    timeSpan: {
      type: Date,
      required: true,
      default: new Date(),
    },
    message: {
      required: true,
      type: String,
    },
    type: {
      required: true,
      type: String,
    },
    userID: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

/**
 * Defines the schema for the audit log table using Knex.
 * @param {Knex.TableBuilder} table - The Knex TableBuilder object to define the schema on.
 * @returns None
 */
const auditLogSchemaKnex = (table: Knex.TableBuilder) => {
  table.increments("_id");
  table.dateTime("timeSpan").notNullable();
  table.string("message").notNullable();
  table.string("type").notNullable();
  table.string("userID").notNullable();
};

export { auditLogSchemaMongoose, auditLogSchemaKnex };
