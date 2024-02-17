import { userTableCollection } from "@eco-flow/types";
import { Schema } from "mongoose";

const mongooseSchema = new Schema<userTableCollection>({
  name: String,
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  isActive: {
    required: true,
    type: Boolean,
    default: true,
  },
  email: String,
  oldPassword: String,
  isPermanent: Boolean,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const knexSchema = (table: any) => {
  table.increments("_id");
  table.string("name");
  table.string("username");
  table.string("password");
  table.boolean("isActive");
  table.string("email");
  table.string("oldPassword");
  table.boolean("isPermanent");
  table.timestamps(true, true);
};

export { mongooseSchema, knexSchema };
