import mongoose, {
  ApplySchemaOptions,
  CompileModelOptions,
  Model,
  ObtainDocumentType,
  ResolveSchemaOptions,
  SchemaDefinition,
  SchemaOptions,
} from "mongoose";

export interface DriverMongoose {
  get getMongoose(): typeof mongoose;

  get getSchema(): typeof mongoose.Schema;

  get getConnection(): mongoose.Connection;

  get getDocument(): typeof mongoose.Document;

  get getQuery(): typeof mongoose.Query;

  get getAggregate(): typeof mongoose.Aggregate;

  get getSchemaType(): typeof mongoose.SchemaType;

  get getVirtualType(): typeof mongoose.VirtualType;

  buildModel<T>(
    name: string,
    schema: {
      definition:
        | SchemaDefinition
        | ApplySchemaOptions<
            ObtainDocumentType<any, any, ResolveSchemaOptions<SchemaOptions>>,
            ResolveSchemaOptions<SchemaOptions>
          >;
      options?: SchemaOptions | ResolveSchemaOptions<SchemaOptions>;
    },
    collection?: string,
    options?: CompileModelOptions
  ): Model<T>;

  listCollections(): Promise<string[]>;
  collectionInfo(collection: string): Promise<Array<CollectionInfo>>;
  collectionInfo(
    collection: string,
    options?: collectionInfoOptions
  ): Promise<Array<CollectionInfo>>;
}

export interface CollectionInfo {
  keys: CollectionTypes[];
  types: { [key: string]: CollectionTypes };
  values: any;
}

export interface collectionInfoOptions {
  subColumn?: string;
  match?: { [key: string]: any };
}

export type CollectionTypes =
  | "objectId"
  | "array"
  | "binData"
  | "bool"
  | "javascriptWithScope"
  | "date"
  | "decimal"
  | "double"
  | "int"
  | "long"
  | "maxKey"
  | "minKey"
  | "null"
  | "object"
  | "regex"
  | "string"
  | "symbol"
  | "timestamp";

export interface DatabaseCollectionInfo {
  keys: CollectionTypes[];
  types: {
    [key: string]: CollectionTypes;
  };
  data: any;
}
