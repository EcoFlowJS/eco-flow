import {
  DatabaseColumnInfo,
  DatabaseCreateEditModel,
  DatabaseTableTypes,
  DriverKnex,
  DriverMongoose,
} from "../../database";

export interface SchemaEditorService<InstanceType = SchemaEditor> {
  new (connection: DriverKnex | DriverMongoose): InstanceType;
}

export interface SchemaEditor {
  createCollectionsORTable(
    tableCollectionName: string,
    tableLike?: string
  ): Promise<CreateCollectionsORTableResult>;
  getCollectionOrTable(): Promise<CollectionOrTableResult>;
  getDatabaseData(collectionORtableName: string): Promise<DatabaseDataResult>;
  deleteCollectionsORTable(
    collectionTable: string
  ): Promise<DeleteCollectionsORTableResult>;
  renameCollectionsORTable(
    collectionTableOldName: string,
    collectionTableNewName: string
  ): Promise<RenameCollectionsORTableResult>;
  commitSaveTableColumn(
    tableName: string,
    columnData: DatabaseColumnData
  ): Promise<CommitSaveTableColumnResult>;

  getTableColumnInfo(columnName: string): Promise<TableColumnInfoResult>;
  insertDatabaseData(
    collectionORtableName: string,
    insertData: {
      [key: string]: any;
    }
  ): Promise<DatabaseDataResult>;
  updateDatabaseData(
    collectionORtableName: string,
    oldData: {
      [key: string]: any;
    },
    newData: {
      [key: string]: any;
    }
  ): Promise<DatabaseDataResult>;
  deleteDatabaseData(
    collectionORtableName: string,
    dataID: string
  ): Promise<DatabaseDataResult>;
}

interface CollectionsORtables {
  collectionsORtables: string[];
}

export interface AlterSqliteColumn {
  oldColumnName: string;
  type: DatabaseTableTypes;
  columnData: DatabaseCreateEditModel;
}

export interface TableColumnInfoResult {
  columnInfo: DatabaseColumnInfo[];
}

export interface DatabaseColumnData {
  deleteDatabaseColumns: DatabaseColumnInfo[];
  modifyDatabaseColumns: {
    oldDatabaseColumns: DatabaseColumnInfo;
    newDatabaseColumns: DatabaseColumnInfo;
  }[];
  createDatabaseColumns: DatabaseColumnInfo[];
}

export interface CommitSaveTableColumnResult extends TableColumnInfoResult {
  status: {
    failedCount: number;
    successCount: number;
    excepted: boolean;
  };
}

export interface RenameCollectionsORTableResult extends CollectionsORtables {
  newCollectionTableName: string;
}

export interface CreateCollectionsORTableResult extends CollectionsORtables {
  currentCollectionTableName: string;
}

export interface DeleteCollectionsORTableResult extends CollectionsORtables {}

export interface CollectionOrTableResult extends CollectionsORtables {
  type: "MONGO" | "KNEX";
}

export interface DatabaseDataResult {
  columns?: DatabaseColumnInfo[];
  modifiedCount?: number;
  data: any;
}

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
