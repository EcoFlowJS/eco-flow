import { Knex } from "knex";
import { Connection } from "mongoose";
import { DatabaseColumnInfo } from "../../database";

export interface SchemaEditorService<InstanceType = SchemaEditor> {
  new (connection: Knex<any, any[]> | Connection): InstanceType;
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
  ): Promise<commitSaveTableColumnResult | null>;

  getTableColumnInfo(columnName: string): Promise<TableColumnInfoResult | null>;
}

interface CollectionsORtables {
  collectionsORtables: string[];
}

export interface TableColumnInfoResult {
  columnInfo: DatabaseColumnInfo[];
}

export interface DatabaseColumnData {
  deleteDatabaseColumns: DatabaseColumnInfo[];
  modifyDatabaseColumns: DatabaseColumnInfo[];
  createDatabaseColumns: DatabaseColumnInfo[];
}

export interface commitSaveTableColumnResult extends TableColumnInfoResult {}

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
