import {
  CollectionOrTableResult,
  Database,
  DatabaseDataResult,
  SchemaEditorService as ISchemaEditorService,
  Knex,
} from "@eco-flow/types";
import { Connection } from "mongoose";

export class SchemaEditorService implements ISchemaEditorService {
  private connection: Knex<any, any[]> | Connection;
  private database: Database;
  constructor(connection: Knex<any, any[]> | Connection) {
    const { database } = ecoFlow;
    this.connection = connection;
    this.database = database;
  }

  async getCollectionOrTable(): Promise<CollectionOrTableResult | null> {
    if (this.database.isKnex(this.connection))
      return {
        type: "KNEX",
        collectionsORtables: await this.connection.listTables(),
      };

    if (this.database.isMongoose(this.connection))
      return {
        type: "MONGO",
        collectionsORtables: await this.connection.listCollections(),
      };

    return null;
  }

  async getDatabaseData(
    collectionORtableName: string
  ): Promise<DatabaseDataResult | null> {
    if (this.database.isKnex(this.connection)) {
      return {
        columns: Object.keys(
          await this.connection.getColumnInfo(collectionORtableName)
        ),
        data: await this.connection
          .queryBuilder(collectionORtableName)
          .select(),
      };
    }

    if (this.database.isMongoose(this.connection)) {
      const collection = await this.connection.getConnection.collection(
        collectionORtableName
      );
      return {
        data: await collection.find().toArray(),
      };
    }

    return null;
  }
}
