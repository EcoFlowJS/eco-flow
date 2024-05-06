import {
  DatabaseColumnInfo,
  DatabaseCreateEditModel,
  DatabaseTableTypes,
  DriverKnex,
  DriverMongoose,
} from "../../database";

/**
 * Interface for a Schema Editor that provides methods to interact with database collections or tables.
 */
export interface SchemaEditor {
  /**
   * Creates a new collection or table in the database based on the type of connection.
   * @param {string} tableCollectionName - The name of the collection or table to create.
   * @param {string} [tableLike] - The name of the table to base the new table on (optional).
   * @returns {Promise<CreateCollectionsORTableResult>} An object containing the list of collections/tables and the name of the current collection/table.
   * @throws {string} Throws an error if an empty database collection or table name is provided, or if an invalid database connection is specified.
   */
  createCollectionsORTable(
    tableCollectionName: string,
    tableLike?: string
  ): Promise<CreateCollectionsORTableResult>;

  /**
   * Retrieves the collection or table information based on the type of database connection.
   * @returns {Promise<CollectionOrTableResult>} A promise that resolves to an object containing
   * the type of database connection ("KNEX" or "MONGO") and the list of collections or tables.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  getCollectionOrTable(): Promise<CollectionOrTableResult>;

  /**
   * Retrieves database data based on the provided collection or table name.
   * @param {string} collectionORtableName - The name of the collection or table to retrieve data from.
   * @returns {Promise<DatabaseDataResult>} A promise that resolves to an object containing the retrieved data.
   * @throws {string} Throws an error if the collectionORtableName is empty or if an invalid database connection is specified.
   */
  getDatabaseData(collectionORtableName: string): Promise<DatabaseDataResult>;

  /**
   * Deletes a collection or table from the database based on the connection type.
   * @param {string} collectionTable - The name of the collection or table to delete.
   * @returns {Promise<DeleteCollectionsORTableResult>} An object containing the list of remaining collections or tables after deletion.
   * @throws {string} Throws an error if the collectionTable parameter is empty.
   * @throws {string} Throws an error if there is an issue dropping the collection or table.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  deleteCollectionsORTable(
    collectionTable: string
  ): Promise<DeleteCollectionsORTableResult>;

  /**
   * Renames a collection or table in the database.
   * @param {string} collectionTableOldName - The current name of the collection or table.
   * @param {string} collectionTableNewName - The new name for the collection or table.
   * @returns {Promise<RenameCollectionsORTableResult>} An object containing the new collection/table name
   * and the list of collections/tables after the rename operation.
   * @throws {string} Throws an error if the collection/table names are empty.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  renameCollectionsORTable(
    collectionTableOldName: string,
    collectionTableNewName: string
  ): Promise<RenameCollectionsORTableResult>;

  /**
   * Asynchronously commits the changes to save table columns in the database.
   * @param {string} tableName - The name of the table in the database.
   * @param {DatabaseColumnData} columnData - The data containing information about columns to be modified, created, or deleted.
   * @returns {Promise<CommitSaveTableColumnResult>} A promise that resolves with the result of the commit operation.
   * @throws {string} Throws an error if the database table information is empty, or if there are issues during the commit process.
   */
  commitSaveTableColumn(
    tableName: string,
    columnData: DatabaseColumnData
  ): Promise<CommitSaveTableColumnResult>;

  /**
   * Retrieves information about the columns in a specified database table.
   * @param {string} tableName - The name of the database table to retrieve information for.
   * @returns {Promise<TableColumnInfoResult>} A promise that resolves to an object containing information about the columns in the table.
   * @throws {string} Throws an error if the table name is empty, if the database connection is invalid, or if MongoDB is used (not supported).
   */
  getTableColumnInfo(columnName: string): Promise<TableColumnInfoResult>;

  /**
   * Inserts data into a database collection or table based on the type of database connection.
   * @param {string} collectionORtableName - The name of the collection or table to insert data into.
   * @param {Object} insertData - The data to be inserted into the database.
   * @returns {Promise<DatabaseDataResult>} A promise that resolves to a DatabaseDataResult object.
   * @throws {string} Throws an error if the collectionORtableName is empty, or if there is an issue inserting data.
   */
  insertDatabaseData(
    collectionORtableName: string,
    insertData: {
      [key: string]: any;
    }
  ): Promise<DatabaseDataResult>;

  /**
   * Updates the database data for a given collection or table with new data.
   * @param {string} collectionORtableName - The name of the collection or table in the database.
   * @param {Object} oldData - The old data to be updated.
   * @param {Object} newData - The new data to update with.
   * @returns {Promise<DatabaseDataResult>} An object containing the updated columns and data.
   * @throws {string} Throws an error if the database collection or table is empty, or if the update fails.
   */
  updateDatabaseData(
    collectionORtableName: string,
    oldData: {
      [key: string]: any;
    },
    newData: {
      [key: string]: any;
    }
  ): Promise<DatabaseDataResult>;

  /**
   * Deletes data from a database collection or table based on the provided data ID.
   * @param {string} collectionORtableName - The name of the collection or table from which data will be deleted.
   * @param {string} dataID - The ID of the data to be deleted.
   * @returns {Promise<DatabaseDataResult>} A promise that resolves to a DatabaseDataResult object containing the result of the deletion operation.
   * @throws {string} Throws an error if the collectionORtableName is empty, dataID is not a string, or if the deletion operation fails.
   */
  deleteDatabaseData(
    collectionORtableName: string,
    dataID: string
  ): Promise<DatabaseDataResult>;
}

/**
 * Interface for a Schema Editor Service that defines a constructor function
 * @param {DriverKnex | DriverMongoose} connection - The connection object for the schema editor
 * @returns An instance of the Schema Editor
 */
export interface SchemaEditorService<InstanceType = SchemaEditor> {
  new (connection: DriverKnex | DriverMongoose): InstanceType;
}

/**
 * Interface representing a collection of collections or tables.
 * @property {string[]} collectionsORtables - An array of strings representing collections or tables.
 */
interface CollectionsORtables {
  collectionsORtables: string[];
}

/**
 * Interface representing the details needed to alter a column in a SQLite database table.
 * @interface AlterSqliteColumn
 * @property {string} oldColumnName - The name of the column to be altered.
 * @property {DatabaseTableTypes} type - The type of the database table.
 * @property {DatabaseCreateEditModel} columnData - The data model for creating or editing the column.
 */
export interface AlterSqliteColumn {
  oldColumnName: string;
  type: DatabaseTableTypes;
  columnData: DatabaseCreateEditModel;
}

/**
 * Represents the result of fetching column information for a table.
 * @property {DatabaseColumnInfo[]} columnInfo - The column information.
 */
export interface TableColumnInfoResult {
  columnInfo: DatabaseColumnInfo[];
}

/**
 * Interface representing the data structure for database column operations.
 * @interface DatabaseColumnData
 * @property {DatabaseColumnInfo[]} deleteDatabaseColumns - Array of columns to be deleted.
 * @property {Object[]} modifyDatabaseColumns - Array of objects containing old and new columns to be modified.
 * @property {DatabaseColumnInfo[]} createDatabaseColumns - Array of columns to be created.
 */
export interface DatabaseColumnData {
  deleteDatabaseColumns: DatabaseColumnInfo[];
  modifyDatabaseColumns: {
    oldDatabaseColumns: DatabaseColumnInfo;
    newDatabaseColumns: DatabaseColumnInfo;
  }[];
  createDatabaseColumns: DatabaseColumnInfo[];
}

/**
 * Represents the result of committing changes to a saved table column.
 * Extends TableColumnInfoResult interface.
 * @interface
 * @extends TableColumnInfoResult
 * @property {object} status - Object containing status information.
 * @property {number} status.failedCount - The number of failed commits.
 * @property {number} status.successCount - The number of successful commits.
 * @property {boolean} status.excepted - Indicates if any exceptions occurred during commit.
 */
export interface CommitSaveTableColumnResult extends TableColumnInfoResult {
  status: {
    failedCount: number;
    successCount: number;
    excepted: boolean;
  };
}

/**
 * Represents the result of renaming a collection or table, extending the CollectionsORtables interface.
 * @interface
 * @extends CollectionsORtables
 * @property {string} newCollectionTableName - The new name of the collection or table after renaming.
 */
export interface RenameCollectionsORTableResult extends CollectionsORtables {
  newCollectionTableName: string;
}

/**
 * Interface representing the result of creating collections or tables.
 * Extends the CollectionsORtables interface.
 * @property {string} currentCollectionTableName - The name of the current collection or table.
 */
export interface CreateCollectionsORTableResult extends CollectionsORtables {
  currentCollectionTableName: string;
}

/**
 * Interface that extends the CollectionsORtables interface to represent the result of deleting collections or tables.
 */
export type DeleteCollectionsORTableResult = CollectionsORtables;

/**
 * Represents the result of a collection or table operation, extending the CollectionsORtables interface.
 * @interface CollectionOrTableResult
 * @extends CollectionsORtables
 * @property {string} type - The type of database operation, either "MONGO" or "KNEX".
 */
export interface CollectionOrTableResult extends CollectionsORtables {
  type: "MONGO" | "KNEX";
}

/**
 * Interface representing the result of a database operation.
 * @property {DatabaseColumnInfo[]} [columns] - An array of column information.
 * @property {number} [modifiedCount] - The number of modified records.
 * @property {any} data - The data returned from the database operation.
 */
export interface DatabaseDataResult {
  columns?: DatabaseColumnInfo[];
  modifiedCount?: number;
  data: any;
}

/**
 * Interface representing the connection definitions for a database connection.
 * @interface ConnectionDefinations
 * @property {string} ConnectionName - The name of the connection.
 * @property {string} dbDriver - The driver used for the connection.
 * @property {string} mongoConnectionString - The connection string for MongoDB.
 * @property {string} SqliteFileName - The filename for SQLite database.
 * @property {string} SqliteFileLoc - The file location for SQLite database.
 * @property {string} Host - The host of the database server.
 * @property {number} Port - The port number of the database server.
 * @property {string} Username - The username for the database connection.
 * @property {string} Password - The password for the database connection.
 * @property {string} isSSL - Whether the connection is SSL enabled or not.
 * @property {string} Database - The database to connect to.
 */
export interface ConnectionDefinations {
  ConnectionName: string;
  dbDriver: string;
  mongoConnectionString: string;
  SqliteFileName: string;
  SqliteFileLoc: string;
  Host: string;
  Port: number;
  Username: string;
  Password: string;
  isSSL: boolean;
  Database: string;
}
