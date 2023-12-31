import { Schema } from "mongoose";

export default new Schema({
  name: String,
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});
