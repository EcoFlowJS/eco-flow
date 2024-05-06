import { DatabaseConnection } from "@ecoflow/types";

/**
 * Prepares the database for migration by dropping all tables/collections based on the type of database connection.
 * @param {DatabaseConnection} connection - The database connection object.
 * @returns {Promise<void>} A promise that resolves once the database is prepared for migration.
 * @throws {string} If an invalid database connection is specified.
 */
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
