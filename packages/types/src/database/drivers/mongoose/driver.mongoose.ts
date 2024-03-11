import mongoose, {
  ApplySchemaOptions,
  CompileModelOptions,
  ObtainDocumentType,
  ResolveSchemaOptions,
  Schema,
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

  buildModel(
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
  ): typeof mongoose.Model;

  listCollections(): Promise<string[]>;
  collectionInfo(collection: string): Promise<Array<CollectionInfo>>;
  collectionInfo(
    collection: string,
    options?: collectionInfoOptions
  ): Promise<Array<CollectionInfo>>;
}

export interface CollectionInfo {
  keys: string[];
  types: { [key: string]: string };
  values: any;
}

export interface collectionInfoOptions {
  subColumn?: string;
  match?: { [key: string]: any };
}

export interface DatabaseCollectionInfo {
  keys: string[];
  types: {
    [key: string]:
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
  };
  data: any;
}
