import { Role, Permissions, Knex } from "@eco-flow/types";
import { Schema } from "mongoose";

const RoleSchemaMongoose = new Schema<Role>({
  name: String,
  isDefault: {
    type: Boolean,
    default: false,
  },
  permissions: Array<Permissions>,
});

const RoleSchemaKnex = (table: Knex.TableBuilder) => {
  table.increments("_id");
  table.string("name");
  table.boolean("isDefault").defaultTo(false);
  table.json("permissions");
};

export { RoleSchemaMongoose, RoleSchemaKnex };
