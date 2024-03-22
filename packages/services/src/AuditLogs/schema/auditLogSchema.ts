import { AuditLogSchemaStruct, Knex, AuditLogType } from "@eco-flow/types";
import { Schema } from "mongoose";
import { Database as EcoDB } from "@eco-flow/database";

const auditLogSchemaMongoose = new Schema<AuditLogSchemaStruct>({
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
});

const auditLogSchemaKnex = (table: Knex.TableBuilder) => {
  table.increments("_id");
  table.dateTime("timeSpan").defaultTo(EcoDB.formatKnexDateTime(new Date()));
  table.string("message");
  table.string("type");
};

export { auditLogSchemaMongoose, auditLogSchemaKnex };
