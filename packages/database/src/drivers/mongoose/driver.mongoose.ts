import { DriverMongoose as IDriverMongoose } from "@eco-flow/types";
import mongoose, {
  ApplySchemaOptions,
  CompileModelOptions,
  Connection,
  ObtainDocumentType,
  ResolveSchemaOptions,
  SchemaDefinition,
  SchemaOptions,
} from "mongoose";

export class DriverMongoose implements IDriverMongoose {
  private conn!: Connection;
  async createConnection(
    uri: string,
    options?: mongoose.ConnectOptions
  ): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
      this.conn = mongoose.createConnection(uri, options);
      this.conn.on("connected", () => {
        resolve(this.conn);
      });
      this.conn.on("error", (err) => reject(err.message));
      process.on("unhandledRejection", (reason, promise) => {
        reject((<any>reason).message);
      });
    });
  }

  get getSchema(): typeof mongoose.Schema {
    return mongoose.Schema;
  }

  get getMongoose(): typeof mongoose {
    return mongoose;
  }

  get getConnection(): mongoose.Connection {
    return this.conn;
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
    return this.conn.model(
      name,
      new this.getSchema(schema.definition, schema.options),
      collection,
      options
    );
  }

  async listCollections(): Promise<any> {
    return (await this.conn.db.listCollections().toArray())
      .filter((collections) => collections.type === "collection")
      .map((collections) => collections.name)
      .sort();
  }
}
