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
  CommitSaveTableColumnResult,
  DatabaseTableTypes,
  DriverKnex,
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
  ): Promise<CommitSaveTableColumnResult | null> {
    const { log } = ecoFlow;

    if (this._.isEmpty(columnData)) throw "Empty database table information.";
    if (this.database.isKnex(this.connection)) {
      const status: CommitSaveTableColumnResult["status"] = {
        failedCount: 0,
        successCount: 0,
        excepted: false,
      };

      const processTable = (
        columnBuilder: Knex.ColumnBuilder,
        columnData: DatabaseCreateEditModel
      ) => {
        const { defaultValue, notNull } = columnData;
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
      try {
        await this.connection.schemaBuilder.alterTable(tableName, (table) => {
          columnData.createDatabaseColumns.map((value) => {
            const { columnData, type } = value.actualData!;
            const { textFormat, numberFormat, dateTimeFormat, columnName } =
              columnData!;

            let columnBuilder: Knex.ColumnBuilder | null = null;

            switch (type) {
              case "string":
                if (this._.isEmpty(columnName)) {
                  status.failedCount++;
                  log.info("Empty column name provided.");
                  break;
                }

                if (textFormat === "text")
                  columnBuilder = table.text(columnName);
                if (textFormat === "varchar")
                  columnBuilder = table.string(columnName);

                if (columnBuilder === null) {
                  status.failedCount++;
                  log.info("Invalid text format provided.");
                  break;
                }
                processTable(columnBuilder, columnData!);
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
                processTable(columnBuilder, columnData!);
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
                processTable(columnBuilder, columnData!);
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
                processTable(columnBuilder, columnData!);
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
                processTable(columnBuilder, columnData!);
                break;
            }
          });

          columnData.deleteDatabaseColumns.map((deleteColumn) => {
            const columnName = deleteColumn.actualData!.columnData!.columnName;
            table.dropColumn(columnName);
          });
        });

        const processRawSql = (
          tableName: string,
          oldColumnName: string,
          type?: DatabaseTableTypes,
          columnData?: DatabaseCreateEditModel
        ): string | null => {
          if (this._.isUndefined(type) || this._.isUndefined(columnData))
            return null;

          const client = (this.connection as unknown as DriverKnex).getClient;
          const {
            textFormat,
            numberFormat,
            dateTimeFormat,
            columnName,
            defaultValue,
            notNull,
          } = columnData!;
          let sql = `ALTER TABLE \`${tableName}\` ${
            client === "MYSQL" ? "CHANGE" : client === "PGSQL" ? "ALTER" : ""
          } COLUMN \`${oldColumnName}\` \`${columnName}\` `;

          switch (type) {
            case "string":
              if (textFormat === null) sql += ` VARCHAR(255)`;
              if (textFormat === "text") sql += `TEXT `;
              if (textFormat === "varchar") sql += `VARCHAR(255) `;
              break;

            case "integer":
              if (numberFormat === null) sql += `INT(11) `;
              if (numberFormat === "int") sql += `INT(11) `;
              if (numberFormat === "bigInt") sql += `BIGINT(20) `;
              if (numberFormat === "dec") sql += `DECIMAL(8,2) `;
              if (numberFormat === "float") sql += `FLOAT(8,2) `;
              break;

            case "boolean":
              sql += `TINYINT(1) `;
              break;

            case "datetime":
              if (dateTimeFormat === null) sql += `DATETIME `;
              if (dateTimeFormat === "date") sql += `DATE `;
              if (dateTimeFormat === "datetime") sql += `DATETIME `;
              if (dateTimeFormat === "time") sql += `TIME `;
              break;

            case "json":
              sql += `JSON `;
              break;
          }

          sql += `${
            this._.isBoolean(notNull) && notNull ? "NOT NULL" : "NULL"
          } ${
            !this._.isUndefined(defaultValue) &&
            defaultValue.toString().trim().length > 0
              ? `DEFAULT '${defaultValue.toString().trim()}'`
              : ""
          }`;

          return sql;
        };

        const queries: (string | null)[] = columnData.modifyDatabaseColumns.map(
          (modifyColumn) => {
            const { oldDatabaseColumns, newDatabaseColumns } = modifyColumn;
            const { columnData, type } = newDatabaseColumns.actualData!;
            return processRawSql(
              tableName,
              oldDatabaseColumns.actualData!.columnData!.columnName,
              type,
              columnData
            );
          }
        );

        for await (const query of queries)
          await (this.connection as unknown as DriverKnex).rawBuilder(query);
      } catch (error) {
        status.excepted = true;
        log.info("Failed due to error: " + error);
      }

      if (!status.excepted)
        status.successCount =
          columnData.createDatabaseColumns.length +
          columnData.deleteDatabaseColumns.length +
          columnData.modifyDatabaseColumns.length -
          status.failedCount;

      return { status, ...(await this.getTableColumnInfo(tableName))! };
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
        type === "varchar" || type === "character varying"
          ? "varchar"
          : type === "text"
          ? "text"
          : null;

      const numberFormat = (
        type: any
      ): DatabaseCreateEditModel["numberFormat"] =>
        type === "int" || type === "integer"
          ? "int"
          : type === "bigint"
          ? "bigInt"
          : type === "decimal" || type === "numeric"
          ? "dec"
          : type === "float" || type === "real"
          ? "float"
          : null;

      const dateTimeFormat = (
        type: any
      ): DatabaseCreateEditModel["dateTimeFormat"] =>
        type === "datetime" || type === "timestamp with time zone"
          ? "datetime"
          : type === "date"
          ? "date"
          : type === "time" || type === "time without time zone"
          ? "time"
          : null;

      const processTypeAlias = (type: any): DatabaseTableAlias | null =>
        type === "varchar" || type === "text" || type === "character varying"
          ? "Text"
          : type === "int" ||
            type === "bigint" ||
            type === "decimal" ||
            type === "float" ||
            type === "integer" ||
            type === "numeric" ||
            type === "real"
          ? "Number"
          : type === "datetime" ||
            type === "date" ||
            type === "time" ||
            type === "time without time zone" ||
            type === "timestamp with time zone"
          ? "Date"
          : type === "boolean" || type === "tinyint"
          ? "Boolean"
          : type === "json"
          ? "Json"
          : null;

      const processType = (type: any): DatabaseTableTypes | null =>
        type === "varchar" || type === "text" || type === "character varying"
          ? "string"
          : type === "int" ||
            type === "bigint" ||
            type === "decimal" ||
            type === "float" ||
            type === "integer" ||
            type === "numeric" ||
            type === "real"
          ? "integer"
          : type === "datetime" ||
            type === "date" ||
            type === "time" ||
            type === "time without time zone" ||
            type === "timestamp with time zone"
          ? "datetime"
          : type === "boolean" || type === "tinyint"
          ? "boolean"
          : type === "json"
          ? "json"
          : null;
      const info = Object.keys(columnInfo)
        .filter((t) => t != "_id")
        .map((columnInfoKey) => {
          return <DatabaseColumnInfo>{
            name: columnInfoKey,
            type: processType(columnInfo[columnInfoKey].type),
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
