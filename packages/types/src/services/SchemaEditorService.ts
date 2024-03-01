export interface SchemaEditorService {
  getCollectionOrTable(): Promise<CollectionOrTableResult | null>;
  getDatabaseData(
    collectionORtableName: string
  ): Promise<DatabaseDataResult | null>;
}

export interface CollectionOrTableResult {
  type: "MONGO" | "KNEX";
  collectionsORtables: string[];
}

export interface DatabaseDataResult {
  columns?: string[];
  data: any;
}
