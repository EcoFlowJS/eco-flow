import { DriverKnex, DriverMongoose } from "@ecoflow/types";
import tokenSchema from "../schema/token.schema";

export const tokenModelMongoose = (connection: DriverMongoose) => {
  if (connection.getConnection.models.tokens)
    return connection.getConnection.model("tokens");
  else return connection.buildModel("tokens", { definition: tokenSchema });
};

export const tokenModelKnex = (connection: DriverKnex) =>
  connection.queryBuilder("tokens");
