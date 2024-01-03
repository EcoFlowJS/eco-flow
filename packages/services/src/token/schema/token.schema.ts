import { Schema } from "mongoose";

export default new Schema({
  userId: String,
  token: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  expires_at: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 7),
  },
});
