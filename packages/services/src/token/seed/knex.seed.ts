import { DriverKnex } from "@eco-flow/types";

export default async (connection: DriverKnex) => {
  await connection.schemaBuilder.createTable("tokens", function (table) {
    table.increments();
    table.string("userId");
    table.string("token");
    table.dateTime("expires_at");
    table.timestamps();
  });
};
