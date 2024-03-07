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
  ): Promise<CreateCollectionsORTableResult | null>;
  getCollectionOrTable(): Promise<CollectionOrTableResult | null>;
  getDatabaseData(
    collectionORtableName: string
  ): Promise<DatabaseDataResult | null>;
  deleteCollectionsORTable(
    collectionTable: string
  ): Promise<DeleteCollectionsORTableResult | null>;
  renameCollectionsORTable(
    collectionTableOldName: string,
    collectionTableNewName: string
  ): Promise<RenameCollectionsORTableResult | null>;
  commitSaveTableColumn(
    tableName: string,
    columnData: DatabaseColumnData
  ): Promise<CommitSaveTableColumnResult | null>;

  getTableColumnInfo(columnName: string): Promise<TableColumnInfoResult | null>;
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
  columns?: Array<{
    name: string;
    type: string;
  }>;
  data: any;
}
