import { FlowEditorSettingsConfigurations, Knex } from "@ecoflow/types";
import { ObjectId, Schema } from "mongoose";

const mongooseFlowEditorSettingsSchema = new Schema<
  FlowEditorSettingsConfigurations & { username: string }
>({
  username: {
    type: String,
    required: true,
  },
  keyboardAccessibility: {
    type: Boolean,
    required: true,
    default: false,
  },
  controls: {
    type: Boolean,
    required: true,
    default: false,
  },
  miniMap: {
    type: Boolean,
    required: true,
    default: false,
  },
  panMiniMap: {
    type: Boolean,
    required: true,
    default: false,
  },
  scrollPan: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const knexFlowEditorSettingsSchema = (table: Knex.TableBuilder) => {
  table.increments("_id");
  table.string("username");
  table.boolean("keyboardAccessibility").defaultTo(false);
  table.boolean("controls").defaultTo(false);
  table.boolean("miniMap").defaultTo(false);
  table.boolean("panMiniMap").defaultTo(false);
  table.boolean("scrollPan").defaultTo(false);
};

export { mongooseFlowEditorSettingsSchema, knexFlowEditorSettingsSchema };
