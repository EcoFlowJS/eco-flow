import {
  CollectionOrTableResult,
  CreateCollectionsORTableResult,
  Database,
  DatabaseDataResult,
  DeleteCollectionsORTableResult,
  DriverMongoose,
  EcoFlow,
  Knex,
  RenameCollectionsORTableResult,
  SchemaEditor,
} from "@eco-flow/types";
import { Connection } from "mongoose";

export class SchemaEditorService implements SchemaEditor {
  private connection: Knex<any, any[]> | Connection;
  private database: Database;
  private _: EcoFlow["_"];
  constructor(connection: Knex<any, any[]> | Connection) {
    const { _, database } = ecoFlow;
    this.connection = connection;
    this.database = database;
    this._ = _;
  }

  async createCollectionsORTable(
    tableCollectionName: string,
    tableLike?: string
  ): Promise<CreateCollectionsORTableResult | null> {
    if (this.database.isKnex(this.connection)) {
      if (this._.isEmpty(tableCollectionName))
        throw "Empty database Collection OR table.";
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

  async renameCollectionsORTable(
    collectionTableOldName: string,
    collectionTableNewName: string
  ): Promise<RenameCollectionsORTableResult | null> {
    if (
      this._.isEmpty(collectionTableOldName) ||
      this._.isEmpty(collectionTableNewName)
    )
      throw "Collection Name can't be empty.";

    try {
      if (this.database.isKnex(this.connection)) {
        await this.connection.schemaBuilder.renameTable(
          collectionTableOldName,
          collectionTableNewName
        );

        return {
          newCollectionTableName: collectionTableNewName,
          collectionsORtables: await this.connection.listTables(),
        };
      }

      if (this.database.isMongoose(this.connection)) {
        await this.connection.getConnection.db
          .collection(collectionTableOldName)
          .rename(collectionTableNewName);

        return {
          newCollectionTableName: collectionTableNewName,
          collectionsORtables: await this.connection.listCollections(),
        };
      }
    } catch (err) {
      throw err;
    }
    return null;
  }

  async deleteCollectionsORTable(
    collectionTable: string
  ): Promise<DeleteCollectionsORTableResult | null> {
    if (this._.isEmpty(collectionTable))
      throw "Empty database Collection OR table.";
    if (this.database.isKnex(this.connection))
      try {
        await this.connection.schemaBuilder.dropTableIfExists(collectionTable);

        return {
          collectionsORtables: await this.connection.listTables(),
        };
      } catch (err) {
        throw err;
      }

    if (this.database.isMongoose(this.connection))
      try {
        const model = (() => {
          const connection = this.connection as unknown as DriverMongoose;
          if (connection.getConnection.models[collectionTable])
            return connection.getConnection.model(collectionTable);
          else
            return connection.buildModel(
              collectionTable,
              {
                definition: {},
              },
              collectionTable
            );
        })();

        await model.collection.drop();

        return {
          collectionsORtables: await this.connection.listCollections(),
        };
      } catch (err) {
        throw err;
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
    if (this._.isEmpty(collectionORtableName))
      throw "Empty database Collection OR table.";
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
