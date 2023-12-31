import { DriverKnex, DriverMongoose } from "@eco-flow/types";
import userSchema from "../schema/userSchema";
export const userModelMongoose = (connection: DriverMongoose) => {
  if (connection.getConnection.models.users)
    return connection.getConnection.model("users");
  else return connection.buildModel("users", { definition: userSchema });
};

export const userModelKnex = async (connection: DriverKnex) =>
  (await connection.queryBuilder("users").count())[0]["count(*)"];
