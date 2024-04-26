import { DatabaseConnection, DriverKnex } from "@ecoflow/types";

const prepareDBMigration = async (
  connection: DatabaseConnection
): Promise<void> => {
  const { database } = ecoFlow;

  if (database.isKnex(connection)) {
    const tables = await connection.listTables();
    for await (const tableName of tables) {
      await connection.schemaBuilder.dropTable(tableName);
    }
    return;
  }

  if (database.isMongoose(connection)) {
    const collections = await connection.listCollections();

    for await (const collectionName of collections) {
      await connection.getConnection.db.dropCollection(collectionName);
    }
    return;
  }

  throw "Invalid database connection specified";
};

export default prepareDBMigration;
