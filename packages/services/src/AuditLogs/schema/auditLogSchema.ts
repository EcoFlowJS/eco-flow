import { AuditLogSchemaStruct, Knex, AuditLogType } from "@ecoflow/types";
import { Schema } from "mongoose";
import { Database as EcoDB } from "@ecoflow/database";

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

const auditLogSchemaKnex = (table: Knex.TableBuilder) => {
  table.increments("_id");
  table.dateTime("timeSpan").notNullable();
  table.string("message").notNullable();
  table.string("type").notNullable();
  table.string("userID").notNullable();
};

export { auditLogSchemaMongoose, auditLogSchemaKnex };
