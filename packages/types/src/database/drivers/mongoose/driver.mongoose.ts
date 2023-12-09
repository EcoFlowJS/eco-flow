import mongoose, {
  ApplySchemaOptions,
  CompileModelOptions,
  ObtainDocumentType,
  ResolveSchemaOptions,
  SchemaDefinition,
  SchemaOptions,
} from "mongoose";

export interface DriverMongoose {
  createConnection(
    uri: string,
    options: mongoose.ConnectOptions | undefined
  ): Promise<typeof mongoose>;

  get getMongoose(): typeof mongoose;

  get getSchema(): typeof mongoose.Schema;

  get getConnection(): typeof mongoose.Connection;

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