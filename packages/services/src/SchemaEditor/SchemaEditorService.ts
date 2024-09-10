import {
  CollectionOrTableResult,
  CreateCollectionsORTableResult,
  Database,
  DatabaseColumnData,
  DatabaseColumnInfo,
  DatabaseDataResult,
  DeleteCollectionsORTableResult,
  DriverMongoose,
  EcoFlow,
  Knex,
  RenameCollectionsORTableResult,
  SchemaEditor,
  TableColumnInfoResult,
  CommitSaveTableColumnResult,
  DriverKnex,
  AlterSqliteColumn,
} from "@ecoflow/types";
import {
  alterColumn,
  alterSqliteColumn,
  processColumnBuilder,
  processTable,
} from "./helper/commitSaveTableColumn.helper.js";
import {
  dateTimeFormat,
  getcolumnDefaultValue,
  numberFormat,
  processType,
  processTypeAlias,
  textFormat,
} from "./helper/getTableColumnInfo.helper.js";
import insertDatabaseDataMongoProcessor from "./helper/insertDatabaseDataMongoProcessor.helper.js";
import mongoose from "mongoose";
import dataProcessorMongo from "./helper/getDatabaseData.helper.js";
import { Database as EcoDB } from "@ecoflow/database";

/**
 * Service class for managing schema editing operations on a database using either Knex or Mongoose.
 */
export class SchemaEditorService implements SchemaEditor {
  private connection: DriverKnex | DriverMongoose;
  private database: Database;
  private _: EcoFlow["_"];

  /**
   * Constructor for creating a new instance of a class.
   * @param {DriverKnex | DriverMongoose} connection - The database connection object.
   * @returns None
   */
  constructor(connection: DriverKnex | DriverMongoose) {
    const { _, database } = ecoFlow;
    this.connection = connection;
    this.database = database;
    this._ = _;
  }

  /**
   * Creates a new collection or table in the database based on the type of connection.
   * @param {string} tableCollectionName - The name of the collection or table to create.
   * @param {string} [tableLike] - The name of the table to base the new table on (optional).
   * @returns {Promise<CreateCollectionsORTableResult>} An object containing the list of collections/tables and the name of the current collection/table.
   * @throws {string} Throws an error if an empty database collection or table name is provided, or if an invalid database connection is specified.
   */
  async createCollectionsORTable(
    tableCollectionName: string,
    tableLike?: string
  ): Promise<CreateCollectionsORTableResult> {
    /**
     * Creates a new table in the database using Knex schema builder.
     * If tableLike is provided, it creates a new table based on the structure of the existing table.
     * @param {string} tableCollectionName - The name of the table to be created.
     * @param {string} tableLike - The name of the existing table to base the new table on.
     * @returns An object containing the list of collections/tables, and the name of the current collection/table.
     * @throws Throws an error if the database collection or table name is empty, or if there is an error during table creation.
     */
    if (this.database.isKnex(this.connection)) {
      /**
       * Checks if the table collection name is empty and throws an error if it is.
       * @param {string} tableCollectionName - The name of the table collection to check.
       * @throws {string} Throws an error if the table collection name is empty.
       */
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

    /**
     * If the database is using Mongoose, it creates a model for the given table collection name,
     * creates a collection, and returns information about the collections/tables and the current collection table name.
     * @returns An object containing information about collections/tables and the current collection table name.
     * @throws {Error} If an error occurs during the process.
     */
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

    throw "Invalid database connection specified";
  }

  /**
   * Renames a collection or table in the database.
   * @param {string} collectionTableOldName - The current name of the collection or table.
   * @param {string} collectionTableNewName - The new name for the collection or table.
   * @returns {Promise<RenameCollectionsORTableResult>} An object containing the new collection/table name
   * and the list of collections/tables after the rename operation.
   * @throws {string} Throws an error if the collection/table names are empty.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async renameCollectionsORTable(
    collectionTableOldName: string,
    collectionTableNewName: string
  ): Promise<RenameCollectionsORTableResult> {
    /**
     * Checks if the collectionTableOldName or collectionTableNewName is empty, and throws an error if either is empty.
     * @param {string} collectionTableOldName - The old name of the collection table.
     * @param {string} collectionTableNewName - The new name of the collection table.
     * @throws {string} Throws an error message if either collectionTableOldName or collectionTableNewName is empty.
     */
    if (
      this._.isEmpty(collectionTableOldName) ||
      this._.isEmpty(collectionTableNewName)
    )
      throw "Collection Name can't be empty.";

    try {
      /**
       * Renames a table in the database if the connection is using Knex.
       * @param {string} collectionTableOldName - The current name of the table.
       * @param {string} collectionTableNewName - The new name for the table.
       * @returns An object containing the new collection table name and a list of tables/collections.
       */
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

      /**
       * Renames a collection table in the database if the connection is using Mongoose.
       * @param {string} collectionTableOldName - The name of the collection table to be renamed.
       * @param {string} collectionTableNewName - The new name for the collection table.
       * @returns An object containing the new collection table name and a list of collections/tables.
       */
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
    throw "Invalid database connection specified";
  }

  /**
   * Deletes a collection or table from the database based on the connection type.
   * @param {string} collectionTable - The name of the collection or table to delete.
   * @returns {Promise<DeleteCollectionsORTableResult>} An object containing the list of remaining collections or tables after deletion.
   * @throws {string} Throws an error if the collectionTable parameter is empty.
   * @throws {string} Throws an error if there is an issue dropping the collection or table.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async deleteCollectionsORTable(
    collectionTable: string
  ): Promise<DeleteCollectionsORTableResult> {
    /**
     * Checks if the collectionTable is empty and throws an error if it is.
     * @param {any} collectionTable - The collection or table to check for emptiness.
     * @throws {string} Throws an error message if the collectionTable is empty.
     */
    if (this._.isEmpty(collectionTable))
      throw "Empty database Collection OR table.";

    /**
     * Drops a table if it exists in the database and returns a list of collections or tables.
     * @param {string} collectionTable - The name of the table to drop if it exists.
     * @returns {Promise<{collectionsORtables: string[]}>} A promise that resolves to an object containing a list of collections or tables.
     * @throws {Error} If an error occurs during the table dropping process.
     */
    if (this.database.isKnex(this.connection))
      try {
        await this.connection.schemaBuilder.dropTableIfExists(collectionTable);

        return {
          collectionsORtables: await this.connection.listTables(),
        };
      } catch (err) {
        throw err;
      }

    /**
     * Drops a collection from the database if the connection is using Mongoose.
     * @param {string} collectionTable - The name of the collection to drop.
     * @returns {Promise<{collectionsORtables: any}>} - A promise that resolves to an object
     * containing the list of collections or tables after dropping the specified collection.
     * @throws {string} - If there is an error dropping the collection, an error message is thrown.
     */
    if (this.database.isMongoose(this.connection))
      try {
        if (
          await this.connection.getConnection.db.dropCollection(collectionTable)
        )
          return {
            collectionsORtables: await this.connection.listCollections(),
          };
        throw `Error dropping the ${collectionTable} collection.`;
      } catch (err) {
        throw err;
      }

    throw "Invalid database connection specified";
  }

  /**
   * Asynchronously commits the changes to save table columns in the database.
   * @param {string} tableName - The name of the table in the database.
   * @param {DatabaseColumnData} columnData - The data containing information about columns to be modified, created, or deleted.
   * @returns {Promise<CommitSaveTableColumnResult>} A promise that resolves with the result of the commit operation.
   * @throws {string} Throws an error if the database table information is empty, or if there are issues during the commit process.
   */
  async commitSaveTableColumn(
    tableName: string,
    columnData: DatabaseColumnData
  ): Promise<CommitSaveTableColumnResult> {
    const { log } = ecoFlow;

    /**
     * Checks if the columnData is empty and throws an error if it is.
     * @param {any} columnData - The data to check for emptiness.
     * @throws {string} Throws an error message if the columnData is empty.
     */
    if (this._.isEmpty(columnData)) throw "Empty database table information.";

    /**
     * Modifies the columns of a table in the database based on the provided column data.
     * @param {string} tableName - The name of the table to modify.
     * @param {ColumnData} columnData - An object containing information about the columns to modify.
     * @returns {Promise<{ status: CommitSaveTableColumnResult["status"], ...getTableColumnInfo}>} An object containing the status of the modification process and the updated table information.
     * @throws {Error} Throws an error if the modification process fails.
     */
    if (this.database.isKnex(this.connection)) {
      const status: CommitSaveTableColumnResult["status"] = {
        failedCount: 0,
        successCount: 0,
        excepted: false,
      };

      try {
        const isSqliteColumnMofidy: AlterSqliteColumn[] = [];

        //Column Drop operations
        await this.connection.schemaBuilder.alterTable(tableName, (table) => {
          columnData.deleteDatabaseColumns.forEach((deleteColumn) => {
            table.dropColumn(deleteColumn.actualData!.columnData!.columnName);
          });
        });

        //Column Alter operations for MySql and PostgreSQL
        await this.connection.schemaBuilder.alterTable(tableName, (table) => {
          columnData.modifyDatabaseColumns.forEach((modifyColumn) => {
            const { oldDatabaseColumns, newDatabaseColumns } = modifyColumn;
            const { columnData, type } = newDatabaseColumns.actualData!;

            if (
              this._.isEmpty(
                oldDatabaseColumns.actualData?.columnData?.columnName
              ) ||
              this._.isEmpty(columnData!.columnName)
            ) {
              status.failedCount++;
              log.info("Empty column name provided.");
              return;
            }

            const isSqlite = alterColumn(
              (<DriverKnex>this.connection).client,
              oldDatabaseColumns.actualData?.columnData?.columnName!,
              {
                type: type,
                table: table,
                columnData: columnData!,
              }
            );
            if (isSqlite !== null) isSqliteColumnMofidy.push(isSqlite);
          });
        });

        //Column Creation operations
        await this.connection.schemaBuilder.alterTable(tableName, (table) => {
          columnData.createDatabaseColumns.forEach((value) => {
            const { columnData, type } = value.actualData!;

            if (this._.isEmpty(columnData!.columnName)) {
              status.failedCount++;
              log.info("Empty column name provided.");
              return;
            }

            const columnBuilder = processColumnBuilder(
              type,
              table,
              columnData!
            );

            if (columnBuilder === null) {
              status.failedCount++;
              log.info("Invalid text format provided.");
              return;
            }
            processTable(columnBuilder, columnData!);
          });
        });

        //Column Alter operations for SQLite
        if (isSqliteColumnMofidy.length > 0)
          await alterSqliteColumn(
            this.connection,
            tableName,
            isSqliteColumnMofidy
          );
      } catch (error) {
        status.excepted = true;
        log.info("Failed due to error: " + error);
        throw error;
      }

      if (!status.excepted)
        status.successCount =
          columnData.createDatabaseColumns.length +
          columnData.deleteDatabaseColumns.length +
          columnData.modifyDatabaseColumns.length -
          status.failedCount;

      return { status, ...(await this.getTableColumnInfo(tableName)) };
    }

    /**
     * Checks if the database connection is using Mongoose.
     * If the connection is using Mongoose, it throws an error indicating that MongoDB Database is not supported for the process.
     * @param {any} connection - The database connection to check.
     * @throws {string} Throws an error if the database is using MongoDB with Mongoose.
     */
    if (this.database.isMongoose(this.connection))
      throw "MongoDB Database is not supported for this process.";

    throw "Invalid database connection specified";
  }

  /**
   * Retrieves information about the columns in a specified database table.
   * @param {string} tableName - The name of the database table to retrieve information for.
   * @returns {Promise<TableColumnInfoResult>} A promise that resolves to an object containing information about the columns in the table.
   * @throws {string} Throws an error if the table name is empty, if the database connection is invalid, or if MongoDB is used (not supported).
   */
  async getTableColumnInfo(tableName: string): Promise<TableColumnInfoResult> {
    /**
     * Checks if the tableName is empty and throws an error if it is.
     * @param {string} tableName - The name of the database table to check.
     * @throws {string} Throws an error if the tableName is empty.
     */
    if (this._.isEmpty(tableName)) throw "Empty database table information.";

    /**
     * Retrieves column information from the database using Knex if the connection is Knex.
     * @returns An object containing column information retrieved from the database.
     */
    if (this.database.isKnex(this.connection)) {
      const connection = this.connection;
      const columnInfo: Record<string | number | symbol, Knex.ColumnInfo> =
        await connection.queryBuilder(tableName).columnInfo();

      const info = Object.keys(columnInfo)
        .filter((t) => t != "_id")
        .map((columnInfoKey) => {
          const columnType = columnInfo[columnInfoKey].type.trim();
          const columnDefaultValue = getcolumnDefaultValue(
            connection.client,
            columnInfo[columnInfoKey].defaultValue
          );
          return <DatabaseColumnInfo>{
            name: columnInfoKey,
            type: processType(columnType),
            alias: processTypeAlias(columnType),
            actualData: {
              columnData: {
                columnName: columnInfoKey,
                defaultValue: columnDefaultValue,
                notNull: !columnInfo[columnInfoKey].nullable,
                textFormat: textFormat(columnType),
                numberFormat: numberFormat(columnType),
                dateTimeFormat: dateTimeFormat(columnType),
              },
            },
          };
        });

      return {
        columnInfo: info,
      };
    }

    /**
     * Checks if the database connection is using Mongoose, and throws an error if it is not supported.
     * @param {any} connection - The database connection object to check.
     * @throws {string} Throws an error message if the database is not using Mongoose.
     */
    if (this.database.isMongoose(this.connection))
      throw "MongoDB Database is not supported for this process.";

    throw "Invalid database connection specified";
  }

  /**
   * Retrieves the collection or table information based on the type of database connection.
   * @returns {Promise<CollectionOrTableResult>} A promise that resolves to an object containing
   * the type of database connection ("KNEX" or "MONGO") and the list of collections or tables.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async getCollectionOrTable(): Promise<CollectionOrTableResult> {
    /**
     * Checks if the database connection is using Knex and returns the type as "KNEX" along with a list of tables.
     * @returns An object with type "KNEX" and a list of tables or collections.
     */
    if (this.database.isKnex(this.connection))
      return {
        type: "KNEX",
        collectionsORtables: await this.connection.listTables(),
      };

    /**
     * Checks if the connection is a Mongoose connection and returns the type as "MONGO"
     * along with a list of collections/tables.
     * @returns An object with type "MONGO" and a list of collections/tables.
     */
    if (this.database.isMongoose(this.connection))
      return {
        type: "MONGO",
        collectionsORtables: await this.connection.listCollections(),
      };

    throw "Invalid database connection specified";
  }

  /**
   * Retrieves database data based on the provided collection or table name.
   * @param {string} collectionORtableName - The name of the collection or table to retrieve data from.
   * @returns {Promise<DatabaseDataResult>} A promise that resolves to an object containing the retrieved data.
   * @throws {string} Throws an error if the collectionORtableName is empty or if an invalid database connection is specified.
   */
  async getDatabaseData(
    collectionORtableName: string
  ): Promise<DatabaseDataResult> {
    /**
     * Checks if the collection or table name is empty and throws an error if it is.
     * @param {string} collectionORtableName - The name of the collection or table to check.
     * @throws {string} Throws an error if the collection or table name is empty.
     */
    if (this._.isEmpty(collectionORtableName))
      throw "Empty database Collection OR table.";

    /**
     * If the connection is using Knex, this function retrieves column information and data
     * from the specified table or collection.
     * @param {string} collectionORtableName - The name of the table or collection to retrieve data from.
     * @returns An object containing the columns information and data from the specified table or collection.
     */
    if (this.database.isKnex(this.connection)) {
      return {
        columns: (await this.getTableColumnInfo(collectionORtableName))
          .columnInfo,
        data: await this.connection
          .queryBuilder(collectionORtableName)
          .select(),
      };
    }

    /**
     * Checks if the database connection is using Mongoose and processes the data accordingly.
     * If the connection is using Mongoose, it calls dataProcessorMongo with the connection,
     * collection or table name, and collection information.
     * @returns An object containing the processed data.
     */
    if (this.database.isMongoose(this.connection)) {
      return {
        data: await dataProcessorMongo(
          this.connection,
          collectionORtableName,
          await this.connection.collectionInfo(collectionORtableName)
        ),
      };
    }

    throw "Invalid database connection specified";
  }

  /**
   * Inserts data into a database collection or table based on the type of database connection.
   * @param {string} collectionORtableName - The name of the collection or table to insert data into.
   * @param {Object} insertData - The data to be inserted into the database.
   * @returns {Promise<DatabaseDataResult>} A promise that resolves to a DatabaseDataResult object.
   * @throws {string} Throws an error if the collectionORtableName is empty, or if there is an issue inserting data.
   */
  async insertDatabaseData(
    collectionORtableName: string,
    insertData: {
      [key: string]: any;
    }
  ): Promise<DatabaseDataResult> {
    /**
     * Checks if the collection or table name is empty and throws an error if it is.
     * @param {string} collectionORtableName - The name of the collection or table to check.
     * @throws {string} Throws an error if the collection or table name is empty.
     */
    if (this._.isEmpty(collectionORtableName))
      throw "Empty database Collection OR table.";

    /**
     * Inserts data into a database table using Knex if the connection is Knex.
     * Filters out empty values from the insert data and formats date/time values
     * before inserting. Returns the columns and data after insertion.
     * @param {object} insertData - The data to be inserted into the table.
     * @param {string} collectionORtableName - The name of the collection or table to insert data into.
     * @returns {object} An object containing columns and data after insertion.
     * @throws Throws an error if data insertion fails.
     */
    if (this.database.isKnex(this.connection)) {
      Object.keys(insertData).forEach((key) => {
        if (this._.isEmpty(insertData[key])) delete insertData[key];
      });

      const columnInfo = (await this.getTableColumnInfo(collectionORtableName))
        .columnInfo;

      Object.keys(insertData).forEach((key) => {
        columnInfo.filter((col) => col.name === key)[0].actualData?.columnData
          ?.dateTimeFormat === "datetime" ||
        columnInfo.filter((col) => col.name === key)[0].actualData?.columnData
          ?.dateTimeFormat === "date" ||
        columnInfo.filter((col) => col.name === key)[0].actualData?.columnData
          ?.dateTimeFormat === "time"
          ? (insertData[key] = EcoDB.formatKnexDateTime(
              new Date(insertData[key])
            ))
          : (insertData[key] = insertData[key]);
      });

      const result = await this.connection
        .queryBuilder(collectionORtableName)
        .insert(insertData);

      if (result)
        return {
          columns: columnInfo,
          data: await this.connection
            .queryBuilder(collectionORtableName)
            .select(),
        };

      throw "Could insert data in database table " + collectionORtableName;
    }

    /**
     * Inserts data into a MongoDB collection using Mongoose if the connection is a Mongoose connection.
     * @param {any} insertData - The data to be inserted into the collection.
     * @param {string} collectionORtableName - The name of the collection or table to insert data into.
     * @returns {Promise<{ data: any }>} - A promise that resolves to an object containing the inserted data.
     * @throws {string} - Throws an error if data insertion fails.
     */
    if (this.database.isMongoose(this.connection)) {
      const { id, value } = insertData;

      const result = await this.connection.getConnection.db
        .collection(collectionORtableName)
        .insertOne({
          _id: new mongoose.Types.ObjectId(id),
          ...insertDatabaseDataMongoProcessor(value),
        });

      if (result.insertedId)
        return {
          data: await dataProcessorMongo(
            this.connection,
            collectionORtableName,
            await this.connection.collectionInfo(collectionORtableName)
          ),
        };

      throw "Could insert data in database table " + collectionORtableName;
    }

    throw "Invalid database connection specified";
  }

  /**
   * Updates the database data for a given collection or table with new data.
   * @param {string} collectionORtableName - The name of the collection or table in the database.
   * @param {Object} oldData - The old data to be updated.
   * @param {Object} newData - The new data to update with.
   * @returns {Promise<DatabaseDataResult>} An object containing the updated columns and data.
   * @throws {string} Throws an error if the database collection or table is empty, or if the update fails.
   */
  async updateDatabaseData(
    collectionORtableName: string,
    oldData: {
      [key: string]: any;
    },
    newData: {
      [key: string]: any;
    }
  ): Promise<DatabaseDataResult> {
    /**
     * Checks if the collection or table name is empty and throws an error if it is.
     * @param {string} collectionORtableName - The name of the collection or table to check.
     * @throws {string} Throws an error if the collection or table name is empty.
     */
    if (this._.isEmpty(collectionORtableName))
      throw "Empty database Collection OR table.";

    /**
     * Updates data in a database table using Knex if the connection is Knex.
     * @param {string} collectionORtableName - The name of the collection or table to update.
     * @param {object} oldData - The old data to be updated.
     * @param {object} newData - The new data to update.
     * @returns {object} An object containing the columns and updated data if successful.
     * @throws {string} Throws an error if the data could not be updated in the database table.
     */
    if (this.database.isKnex(this.connection)) {
      const columnInfo = (await this.getTableColumnInfo(collectionORtableName))
        .columnInfo;
      Object.keys(newData).forEach((key) => {
        if (this._.isEmpty(newData[key])) {
          const isNullable = !columnInfo.filter((col) => col.name === key)[0]
            .actualData?.columnData?.notNull;
          newData[key] = isNullable ? null : "";
        } else
          columnInfo.filter((col) => col.name === key)[0].actualData?.columnData
            ?.dateTimeFormat === "datetime" ||
          columnInfo.filter((col) => col.name === key)[0].actualData?.columnData
            ?.dateTimeFormat === "date" ||
          columnInfo.filter((col) => col.name === key)[0].actualData?.columnData
            ?.dateTimeFormat === "time"
            ? (newData[key] = EcoDB.formatKnexDateTime(new Date(newData[key])))
            : (newData[key] = newData[key]);
      });

      const result = await this.connection
        .queryBuilder(collectionORtableName)
        .update(newData)
        .where({ _id: oldData._id });

      if (result)
        return {
          columns: columnInfo,
          data: await this.connection
            .queryBuilder(collectionORtableName)
            .select(),
        };

      throw "Could update data in database table " + collectionORtableName;
    }

    /**
     * Updates data in a MongoDB collection if the connection is using Mongoose.
     * @param {object} newData - The new data to update in the collection.
     * @param {object} oldData - The old data to be updated.
     * @param {string} collectionORtableName - The name of the collection or table to update.
     * @returns {object} An object containing the updated data and the number of modified documents.
     * @throws {string} Throws an error if the data could not be updated in the database table.
     */
    if (this.database.isMongoose(this.connection)) {
      Object.keys(newData.value).map((key) => {
        if (typeof oldData.data[key] !== "undefined") delete oldData.data[key];
      });

      const result = await this.connection.getConnection.db
        .collection(collectionORtableName)
        .updateOne(
          { _id: new mongoose.Types.ObjectId(oldData.id) },
          {
            $set: insertDatabaseDataMongoProcessor(newData.value),
            $unset: oldData.data,
          }
        );

      if (result.matchedCount > 0)
        return {
          data: await dataProcessorMongo(
            this.connection,
            collectionORtableName,
            await this.connection.collectionInfo(collectionORtableName)
          ),
          modifiedCount: result.modifiedCount,
        };

      throw "Could update data in database table " + collectionORtableName;
    }

    throw "Invalid database connection specified";
  }

  /**
   * Deletes data from a database collection or table based on the provided data ID.
   * @param {string} collectionORtableName - The name of the collection or table from which data will be deleted.
   * @param {string} dataID - The ID of the data to be deleted.
   * @returns {Promise<DatabaseDataResult>} A promise that resolves to a DatabaseDataResult object containing the result of the deletion operation.
   * @throws {string} Throws an error if the collectionORtableName is empty, dataID is not a string, or if the deletion operation fails.
   */
  async deleteDatabaseData(
    collectionORtableName: string,
    dataID: string
  ): Promise<DatabaseDataResult> {
    /**
     * Checks if the collection or table name is empty and throws an error if it is.
     * @param {string} collectionORtableName - The name of the database collection or table.
     * @throws {string} Throws an error if the collection or table name is empty.
     */
    if (this._.isEmpty(collectionORtableName))
      throw "Empty database Collection OR table.";

    /**
     * Deletes a record from the database table based on the provided data ID.
     * @param {string} dataID - The ID of the record to be deleted.
     * @param {string} collectionORtableName - The name of the collection or table to delete the record from.
     * @returns {Object} An object containing columns and data of the table after deletion.
     * @throws {string} If the record could not be deleted, an error message is thrown.
     */
    if (this.database.isKnex(this.connection)) {
      if (typeof dataID !== "string") throw "Invalid database record ID.";

      const result = await this.connection
        .queryBuilder(collectionORtableName)
        .delete()
        .where({ _id: dataID });
      if (result)
        return {
          columns: (await this.getTableColumnInfo(collectionORtableName))
            .columnInfo,
          data: await this.connection
            .queryBuilder(collectionORtableName)
            .select(),
        };

      throw `Could delete Record in database table ${collectionORtableName} with id : ${dataID}`;
    }

    /**
     * Deletes a record from a MongoDB collection using the provided data ID.
     * @param {string} collectionORtableName - The name of the collection or table to delete from.
     * @param {string} dataID - The ID of the data record to delete.
     * @returns {Object} - An object containing the data after deletion if successful.
     * @throws {string} - Error message if deletion was unsuccessful.
     */
    if (this.database.isMongoose(this.connection)) {
      const result = await this.connection.getConnection.db
        .collection(collectionORtableName)
        .deleteOne({
          _id: new mongoose.Types.ObjectId(dataID),
        });

      if (result && result.deletedCount > 0)
        return {
          data: await dataProcessorMongo(
            this.connection,
            collectionORtableName,
            await this.connection.collectionInfo(collectionORtableName)
          ),
        };

      throw `Could delete Record in database collection ${collectionORtableName} with id : ${dataID}`;
    }

    throw "Invalid database connection specified";
  }
}
