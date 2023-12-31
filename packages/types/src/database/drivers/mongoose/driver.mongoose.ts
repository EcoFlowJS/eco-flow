import mongoose, {
  ApplySchemaOptions,
  CompileModelOptions,
  Connection,
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
}
