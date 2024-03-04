import { Knex } from "knex";
import { Connection } from "mongoose";

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
}

export interface CreateCollectionsORTableResult {
  collectionsORtables: string[];
  currentCollectionTableName: string;
}

export interface DeleteCollectionsORTableResult {
  collectionsORtables: string[];
}

export interface CollectionOrTableResult {
  type: "MONGO" | "KNEX";
  collectionsORtables: string[];
}

export interface DatabaseDataResult {
  columns?: Array<{
    name: string;
    type: string;
  }>;
  data: any;
}
