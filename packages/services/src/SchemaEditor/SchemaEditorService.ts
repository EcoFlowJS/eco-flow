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
} from "@eco-flow/types";
import {
  alterColumn,
  alterSqliteColumn,
  processColumnBuilder,
  processTable,
} from "./helper/commitSaveTableColumn.helper";
import {
  dateTimeFormat,
  getcolumnDefaultValue,
  numberFormat,
  processType,
  processTypeAlias,
  textFormat,
} from "./helper/getTableColumnInfo.helper";
import {
  formateDateTime,
  processMongo,
} from "./helper/insertDatabaseData.helper";
import mongoose, { Schema, Types } from "mongoose";
import dataProcessorMongo from "./helper/getDatabaseData.helper";

export class SchemaEditorService implements SchemaEditor {
  private connection: DriverKnex | DriverMongoose;
  private database: Database;
  private _: EcoFlow["_"];
  constructor(connection: DriverKnex | DriverMongoose) {
    const { _, database } = ecoFlow;
    this.connection = connection;
    this.database = database;
    this._ = _;
  }

  async createCollectionsORTable(
    tableCollectionName: string,
    tableLike?: string
  ): Promise<CreateCollectionsORTableResult> {
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
    throw "Invalid database connection specified";
  }

  async renameCollectionsORTable(
    collectionTableOldName: string,
    collectionTableNewName: string
  ): Promise<RenameCollectionsORTableResult> {
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
    throw "Invalid database connection specified";
  }

  async deleteCollectionsORTable(
    collectionTable: string
  ): Promise<DeleteCollectionsORTableResult> {
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

  async commitSaveTableColumn(
    tableName: string,
    columnData: DatabaseColumnData
  ): Promise<CommitSaveTableColumnResult> {
    const { log } = ecoFlow;

    if (this._.isEmpty(columnData)) throw "Empty database table information.";
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
              (<DriverKnex>this.connection).getClient,
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

    if (this.database.isMongoose(this.connection))
      throw "MongoDB Database is not supported for this process.";

    throw "Invalid database connection specified";
  }

  async getTableColumnInfo(tableName: string): Promise<TableColumnInfoResult> {
    if (this._.isEmpty(tableName)) throw "Empty database table information.";
    if (this.database.isKnex(this.connection)) {
      const connection = this.connection;
      const columnInfo: Record<string | number | symbol, Knex.ColumnInfo> =
        await connection.queryBuilder(tableName).columnInfo();

      const info = Object.keys(columnInfo)
        .filter((t) => t != "_id")
        .map((columnInfoKey) => {
          const columnType = columnInfo[columnInfoKey].type.trim();
          const columnDefaultValue = getcolumnDefaultValue(
            connection.getClient,
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

    if (this.database.isMongoose(this.connection))
      throw "MongoDB Database is not supported for this process.";

    throw "Invalid database connection specified";
  }

  async getCollectionOrTable(): Promise<CollectionOrTableResult> {
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

    throw "Invalid database connection specified";
  }

  async getDatabaseData(
    collectionORtableName: string
  ): Promise<DatabaseDataResult> {
    if (this._.isEmpty(collectionORtableName))
      throw "Empty database Collection OR table.";
    if (this.database.isKnex(this.connection)) {
      return {
        columns: (await this.getTableColumnInfo(collectionORtableName))
          .columnInfo,
        data: await this.connection
          .queryBuilder(collectionORtableName)
          .select(),
      };
    }

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

  async insertDatabaseData(
    collectionORtableName: string,
    insertData: {
      [key: string]: any;
    }
  ): Promise<DatabaseDataResult> {
    if (this._.isEmpty(collectionORtableName))
      throw "Empty database Collection OR table.";

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
          ? (insertData[key] = formateDateTime(new Date(insertData[key])))
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

    if (this.database.isMongoose(this.connection)) {
      const { id, value } = insertData;

      const result = await this.connection.getConnection.db
        .collection(collectionORtableName)
        .insertOne({
          _id: new mongoose.Types.ObjectId(id),
          ...processMongo(value),
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

  async updateDatabaseData(
    collectionORtableName: string,
    oldData: {
      [key: string]: any;
    },
    newData: {
      [key: string]: any;
    }
  ): Promise<DatabaseDataResult> {
    if (this._.isEmpty(collectionORtableName))
      throw "Empty database Collection OR table.";

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
            ? (newData[key] = formateDateTime(new Date(newData[key])))
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

    if (this.database.isMongoose(this.connection)) {
      Object.keys(newData.value).map((key) => {
        if (typeof oldData.data[key] !== "undefined") delete oldData.data[key];
      });

      const result = await this.connection.getConnection.db
        .collection(collectionORtableName)
        .updateOne(
          { _id: new mongoose.Types.ObjectId(oldData.id) },
          { $set: processMongo(newData.value), $unset: oldData.data }
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

  async deleteDatabaseData(
    collectionORtableName: string,
    dataID: string
  ): Promise<DatabaseDataResult> {
    if (this._.isEmpty(collectionORtableName))
      throw "Empty database Collection OR table.";

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

      console.log(dataID);
    }

    throw "Invalid database connection specified";
  }
}
