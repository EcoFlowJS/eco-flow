import { Knex, userTableCollection } from "@eco-flow/types";
import { ObjectId, Schema } from "mongoose";

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
  roles: {
    required: true,
    type: Array<ObjectId>,
  },
  isActive: {
    required: true,
    type: Boolean,
    default: true,
  },
  email: String,
  oldPassword: String,
  isPermanent: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const knexSchema = (table: Knex.TableBuilder) => {
  table.increments("_id");
  table.string("name");
  table.string("username");
  table.json("roles");
  table.string("password");
  table.boolean("isActive").defaultTo(true);
  table.string("email");
  table.string("oldPassword");
  table.boolean("isPermanent").defaultTo(false);
  table.timestamps(true, true);
};

export { mongooseSchema, knexSchema };
