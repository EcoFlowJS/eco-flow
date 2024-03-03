import {
  CollectionOrTableResult,
  CreateCollectionsORTableResult,
  Database,
  DatabaseDataResult,
  DriverMongoose,
  Knex,
  SchemaEditor,
} from "@eco-flow/types";
import { Connection } from "mongoose";

export class SchemaEditorService implements SchemaEditor {
  private connection: Knex<any, any[]> | Connection;
  private database: Database;
  constructor(connection: Knex<any, any[]> | Connection) {
    const { database } = ecoFlow;
    this.connection = connection;
    this.database = database;
  }

  async createCollectionsORTable(
    tableCollectionName: string,
    tableLike?: string
  ): Promise<CreateCollectionsORTableResult | null> {
    if (this.database.isKnex(this.connection)) {
      try {
        if (typeof tableLike === "undefined" || tableLike === null)
          await this.connection.schemaBuilder.createTable(
            tableCollectionName,
            (table) => {
              table.increments("_id").primary().unique().notNullable();
            }
          );
        else
          await this.connection.schemaBuilder.createTableLike(
            tableCollectionName,
            tableLike
          );

        return {
          collectionsORtables: await this.connection.listTables(),
          currentCollectionTableName: tableCollectionName,
        };
      } catch (err) {
        throw err;
      }
    }

    if (this.database.isMongoose(this.connection)) {
      try {
        const model = (() => {
          const connection = this.connection as unknown as DriverMongoose;
          if (connection.getConnection.models[tableCollectionName])
            return connection.getConnection.model(tableCollectionName);
          else
            return connection.buildModel(
              tableCollectionName,
              {
                definition: {},
              },
              tableCollectionName
            );
        })();
        await model.createCollection();

        return {
          collectionsORtables: await this.connection.listCollections(),
          currentCollectionTableName: tableCollectionName,
        };
      } catch (err) {
        throw err;
      }
    }
    return null;
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
      const columns = await this.connection.getColumnInfo(
        collectionORtableName
      );

      return {
        columns: Object.keys(columns).map((columnName) => {
          return {
            name: columnName,
            type: columns[columnName].type,
          };
        }),
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
