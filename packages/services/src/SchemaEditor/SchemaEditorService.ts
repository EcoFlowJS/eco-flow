import {
  CollectionOrTableResult,
  CreateCollectionsORTableResult,
  Database,
  DatabaseColumnData,
  DatabaseColumnInfo,
  DatabaseCreateEditModel,
  DatabaseDataResult,
  DatabaseTableAlias,
  DeleteCollectionsORTableResult,
  DriverMongoose,
  EcoFlow,
  Knex,
  RenameCollectionsORTableResult,
  SchemaEditor,
  TableColumnInfoResult,
  commitSaveTableColumnResult,
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

  async commitSaveTableColumn(
    tableName: string,
    columnData: DatabaseColumnData
  ): Promise<commitSaveTableColumnResult | null> {
    const { log } = ecoFlow;

    if (this._.isEmpty(columnData)) throw "Empty database table information.";
    if (this.database.isKnex(this.connection)) {
      const status = Object.create({
        failedCount: 0,
        successCount: 0,
      });
      await this.connection.schemaBuilder.alterTable(tableName, (table) => {
        columnData.createDatabaseColumns.map((value) => {
          const { columnData, type } = value.actualData!;
          const {
            textFormat,
            numberFormat,
            dateTimeFormat,
            columnName,
            defaultValue,
            notNull,
          } = columnData!;

          let columnBuilder: Knex.ColumnBuilder | null = null;

          const processTable = (columnBuilder: Knex.ColumnBuilder) => {
            if (
              !this._.isUndefined(defaultValue) &&
              defaultValue.toString().trim().length > 0
            ) {
              columnBuilder.defaultTo(defaultValue.toString().trim());
            }
            if (this._.isBoolean(notNull) && notNull) {
              columnBuilder.notNullable();
            }
          };

          switch (type) {
            case "string":
              if (this._.isEmpty(columnName)) {
                status.failedCount++;
                log.info("Empty column name provided.");
                break;
              }

              if (textFormat === "text") columnBuilder = table.text(columnName);
              if (textFormat === "varchar")
                columnBuilder = table.string(columnName);

              if (columnBuilder === null) {
                status.failedCount++;
                log.info("Invalid text format provided.");
                break;
              }
              processTable(columnBuilder);
              break;

            case "integer":
              if (this._.isEmpty(columnName)) {
                status.failedCount++;
                log.info("Empty column name provided.");
                break;
              }

              if (numberFormat === null)
                columnBuilder = table.integer(columnName);
              if (numberFormat === "int")
                columnBuilder = table.integer(columnName);
              if (numberFormat === "bigInt")
                columnBuilder = table.bigint(columnName);
              if (numberFormat === "dec")
                columnBuilder = table.decimal(columnName);
              if (numberFormat === "float")
                columnBuilder = table.float(columnName);

              if (columnBuilder === null) {
                status.failedCount++;
                log.info("Invalid integer format provided.");
                break;
              }
              processTable(columnBuilder);
              break;

            case "boolean":
              if (this._.isEmpty(columnName)) {
                status.failedCount++;
                log.info("Empty column name provided.");
                break;
              }
              columnBuilder = table.boolean(columnName);
              if (columnBuilder === null) {
                status.failedCount++;
                log.info("Invalid boolean format provided.");
                break;
              }
              processTable(columnBuilder);
              break;

            case "datetime":
              if (this._.isEmpty(columnName)) {
                status.failedCount++;
                log.info("Empty column name provided.");
                break;
              }

              if (dateTimeFormat === null)
                columnBuilder = table.datetime(columnName);
              if (dateTimeFormat === "date")
                columnBuilder = table.date(columnName);
              if (dateTimeFormat === "datetime")
                columnBuilder = table.datetime(columnName);
              if (dateTimeFormat === "time")
                columnBuilder = table.time(columnName);

              if (columnBuilder === null) {
                status.failedCount++;
                log.info("Invalid datetime format provided.");
                break;
              }
              processTable(columnBuilder);
              break;

            case "json":
              if (this._.isEmpty(columnName)) {
                status.failedCount++;
                log.info("Empty column name provided.");
                break;
              }
              columnBuilder = table.json(columnName);
              if (columnBuilder === null) {
                status.failedCount++;
                log.info("Invalid json format provided.");
                break;
              }
              processTable(columnBuilder);
              break;

            case "foreign":
              if (this._.isEmpty(columnName)) {
                status.failedCount++;
                log.info("Empty column name provided.");
                break;
              }
              table
                .foreign("_id", columnName)
                .references("_id")
                .inTable("rom2");
              if (columnBuilder === null) {
                status.failedCount++;
                log.info("Invalid foreign format provided.");
                break;
              }
              break;
          }
        });
        columnData.deleteDatabaseColumns.map((deleteColumn) => {
          const columnName = deleteColumn.actualData!.columnData!.columnName;
          table.dropColumn(columnName);
        });
      });

      return { ...(await this.getTableColumnInfo(tableName))! };
    }

    if (this.database.isMongoose(this.connection))
      throw "MongoDB Database is not supported for this process.";
    return null;
  }

  async getTableColumnInfo(
    tableName: string
  ): Promise<TableColumnInfoResult | null> {
    if (this._.isEmpty(tableName)) throw "Empty database table information.";
    if (this.database.isKnex(this.connection)) {
      const columnInfo: Record<string | number | symbol, Knex.ColumnInfo> =
        await this.connection.queryBuilder(tableName).columnInfo();

      const textFormat = (type: any): DatabaseCreateEditModel["textFormat"] =>
        type === "varchar" ? "varchar" : type === "text" ? "text" : null;

      const numberFormat = (
        type: any
      ): DatabaseCreateEditModel["numberFormat"] =>
        type === "int"
          ? "int"
          : type === "bigint"
          ? "bigInt"
          : type === "decimal"
          ? "dec"
          : type === "float"
          ? "float"
          : null;

      const dateTimeFormat = (
        type: any
      ): DatabaseCreateEditModel["dateTimeFormat"] =>
        type === "datetime"
          ? "datetime"
          : type === "date"
          ? "date"
          : type === "time"
          ? "time"
          : null;

      const processTypeAlias = (type: any): DatabaseTableAlias =>
        type === "varchar" || type === "text"
          ? "Text"
          : type === "int" ||
            type === "bigint" ||
            type === "decimal" ||
            type === "float" ||
            type === "integer"
          ? "Number"
          : type === "datetime" || type === "date" || type === "time"
          ? "Date"
          : type === "boolean" || type === "tinyint"
          ? "Boolean"
          : type === "json"
          ? "Json"
          : "Foreign";

      const info = Object.keys(columnInfo)
        .filter((t) => t != "_id")
        .map((columnInfoKey) => {
          return <DatabaseColumnInfo>{
            name: columnInfoKey,
            type: columnInfo[columnInfoKey].type,
            alias: processTypeAlias(columnInfo[columnInfoKey].type),
            actualData: {
              columnData: {
                columnName: columnInfoKey,
                defaultValue:
                  columnInfo[columnInfoKey].defaultValue === null
                    ? ""
                    : columnInfo[columnInfoKey].defaultValue,
                notNull: !columnInfo[columnInfoKey].nullable,
                textFormat: textFormat(columnInfo[columnInfoKey].type),
                numberFormat: numberFormat(columnInfo[columnInfoKey].type),
                dateTimeFormat: dateTimeFormat(columnInfo[columnInfoKey].type),
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
