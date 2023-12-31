import { DriverMongoose } from "@eco-flow/types";
import userSchema from "../schema/userSchema";
export const userModelMongoose = (connection: DriverMongoose) => {
  let user;
  if (connection.getConnection.models.users)
    user = connection.getConnection.model("users");
  else user = connection.buildModel("users", { definition: userSchema });

  return user;
};
