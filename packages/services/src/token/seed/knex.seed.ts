import { DriverKnex } from "@ecoflow/types";

export default async (connection: DriverKnex) => {
  await connection.schemaBuilder.createTable("tokens", function (table) {
    table.increments();
    table.string("userId");
    table.string("token");
    table.datetime("expires_at");
    table.timestamps(true, true);
  });
};
