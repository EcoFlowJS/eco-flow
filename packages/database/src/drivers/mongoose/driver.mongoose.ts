import { DriverMongoose as IDriverMongoose } from "@eco-flow/types";
import mongoose, {
  ApplySchemaOptions,
  CompileModelOptions,
  ObtainDocumentType,
  ResolveSchemaOptions,
  SchemaDefinition,
  SchemaOptions,
} from "mongoose";

export class DriverMongoose implements IDriverMongoose {
  async createConnection(
    uri: string,
    options?: mongoose.ConnectOptions
  ): Promise<typeof mongoose> {
    return await mongoose.connect(uri, options);
  }

  get getSchema(): typeof mongoose.Schema {
    return mongoose.Schema;
  }

  get getMongoose(): typeof mongoose {
    return mongoose;
  }

  get getConnection(): typeof mongoose.Connection {
    return mongoose.Connection;
  }

  get getDocument(): typeof mongoose.Document {
    return mongoose.Document;
  }

  get getQuery(): typeof mongoose.Query {
    return mongoose.Query;
  }

  get getAggregate(): typeof mongoose.Aggregate {
    return mongoose.Aggregate;
  }

  get getSchemaType(): typeof mongoose.SchemaType {
    return mongoose.SchemaType;
  }

  get getVirtualType(): typeof mongoose.VirtualType {
    return mongoose.VirtualType;
  }

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
  ): typeof mongoose.Model {
    return mongoose.model(
      name,
      new this.getSchema(schema.definition, schema.options),
      collection,
      options
    );
  }
}
