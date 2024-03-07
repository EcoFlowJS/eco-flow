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
  AlterSqliteColumn,
} from "@eco-flow/types";
import { Connection } from "mongoose";
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
        await this.connection.schemaBuilder.alterTable(tableName, (table) => {
          columnData.createDatabaseColumns.map((value) => {
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

          columnData.deleteDatabaseColumns.map((deleteColumn) => {
            const columnName = deleteColumn.actualData!.columnData!.columnName;
            table.dropColumn(columnName);
          });

          columnData.modifyDatabaseColumns.map((modifyColumn) => {
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

        if (isSqliteColumnMofidy.length > 0)
          await alterSqliteColumn(
            this.connection,
            tableName,
            isSqliteColumnMofidy
          );

        // const processRawSql = (
        //   tableName: string,
        //   oldColumnName: string,
        //   type?: DatabaseTableTypes,
        //   columnData?: DatabaseCreateEditModel
        // ): string | null => {
        //   if (this._.isUndefined(type) || this._.isUndefined(columnData))
        //     return null;

        //   const client = (this.connection as unknown as DriverKnex).getClient;
        //   const {
        //     textFormat,
        //     numberFormat,
        //     dateTimeFormat,
        //     columnName,
        //     defaultValue,
        //     notNull,
        //   } = columnData!;
        //   let sql = `ALTER TABLE \`${tableName}\` ${
        //     client === "MYSQL" ? "CHANGE" : client === "PGSQL" ? "ALTER" : ""
        //   } COLUMN \`${oldColumnName}\` \`${columnName}\` `;

        //   switch (type) {
        //     case "string":
        //       if (textFormat === null) sql += ` VARCHAR(255)`;
        //       if (textFormat === "text") sql += `TEXT `;
        //       if (textFormat === "varchar") sql += `VARCHAR(255) `;
        //       break;

        //     case "integer":
        //       if (numberFormat === null) sql += `INT(11) `;
        //       if (numberFormat === "int") sql += `INT(11) `;
        //       if (numberFormat === "bigInt") sql += `BIGINT(20) `;
        //       if (numberFormat === "dec") sql += `DECIMAL(8,2) `;
        //       if (numberFormat === "float") sql += `FLOAT(8,2) `;
        //       break;

        //     case "boolean":
        //       sql += `TINYINT(1) `;
        //       break;

        //     case "datetime":
        //       if (dateTimeFormat === null) sql += `DATETIME `;
        //       if (dateTimeFormat === "date") sql += `DATE `;
        //       if (dateTimeFormat === "datetime") sql += `DATETIME `;
        //       if (dateTimeFormat === "time") sql += `TIME `;
        //       break;

        //     case "json":
        //       sql += `JSON `;
        //       break;
        //   }

        //   sql += `${
        //     this._.isBoolean(notNull) && notNull ? "NOT NULL" : "NULL"
        //   } ${
        //     !this._.isUndefined(defaultValue) &&
        //     defaultValue.toString().trim().length > 0
        //       ? `DEFAULT '${defaultValue.toString().trim()}'`
        //       : ""
        //   }`;

        //   return sql;
        // };

        // const queries: (string | null)[] = columnData.modifyDatabaseColumns.map(
        //   (modifyColumn) => {
        //     const { oldDatabaseColumns, newDatabaseColumns } = modifyColumn;
        //     const { columnData, type } = newDatabaseColumns.actualData!;
        //     return processRawSql(
        //       tableName,
        //       oldDatabaseColumns.actualData!.columnData!.columnName,
        //       type,
        //       columnData
        //     );
        //   }
        // );

        // for await (const query of queries)
        //   await (this.connection as unknown as DriverKnex).rawBuilder(query);
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

    throw "Invalid database connection specified";
  }
}
