import {
  CollectionInfo,
  DriverMongoose as IDriverMongoose,
  collectionInfoOptions,
} from "@ecoflow/types";
import mongoose, {
  Connection,
  Model,
  ApplySchemaOptions,
  CompileModelOptions,
  ConnectOptions,
  ObtainDocumentType,
  ResolveSchemaOptions,
  SchemaDefinition,
  SchemaOptions,
} from "mongoose";
import processCollectionInfo from "./collectionInfo.helper.js";

const {
  createConnection: mongooseCreateConnection,
  Schema,
  Document,
  Query,
  Aggregate,
  SchemaType,
  VirtualType,
} = mongoose;

/**
 * A class that implements the DriverMongoose interface and provides methods for interacting with MongoDB using
 */
export class DriverMongoose implements IDriverMongoose {
  private conn!: Connection;

  /**
   * Creates a connection to a MongoDB database using
   * @param {string} uri - The URI of the MongoDB database.
   * @param {ConnectOptions} [options] - Optional connection options.
   * @returns {Promise<Connection>} A promise that resolves to the Mongoose connection object.
   */
  async createConnection(
    uri: string,
    options?: ConnectOptions
  ): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
      this.conn = mongooseCreateConnection(uri, options);
      this.conn.on("connected", () => {
        resolve(this.conn);
      });
      this.conn.on("error", (err) => reject(err.message));
      process.on("unhandledRejection", (reason, promise) => {
        reject((<any>reason).message);
      });
    });
  }

  /**
   * Returns the mongoose Schema class for creating MongoDB schemas.
   * @returns {typeof Schema} The mongoose Schema class.
   */
  get getSchema(): typeof Schema {
    return Schema;
  }

  /**
   * Returns the Mongoose object for interacting with MongoDB using the Mongoose library.
   * @returns The Mongoose object.
   */
  get getMongoose(): typeof mongoose {
    return mongoose;
  }

  /**
   * Getter method to retrieve the mongoose connection object.
   * @returns {Connection} The mongoose connection object.
   */
  get getConnection(): Connection {
    return this.conn;
  }

  /**
   * Returns the type of mongoose Document.
   * @returns {typeof Document} The type of mongoose Document.
   */
  get getDocument(): typeof Document {
    return Document;
  }

  /**
   * Getter method that returns the Query class.
   * @returns The Query class.
   */
  get getQuery(): typeof Query {
    return Query;
  }

  /**
   * Returns the Aggregate class.
   * @returns The Aggregate class.
   */
  get getAggregate(): typeof Aggregate {
    return Aggregate;
  }

  /**
   * Getter method that returns the SchemaType class.
   * @returns The SchemaType class
   */
  get getSchemaType(): typeof SchemaType {
    return SchemaType;
  }

  /**
   * Getter method that returns the VirtualType class.
   * @returns The VirtualType class.
   */
  get getVirtualType(): typeof VirtualType {
    return VirtualType;
  }

  /**
   * Builds and returns a model based on the provided name, schema, collection, and options.
   * @param {string} name - The name of the model.
   * @param {object} schema - The schema definition and options for the model.
   * @param {string} [collection] - The name of the collection in the database.
   * @param {object} [options] - Additional options for compiling the model.
   * @returns {Model<T>} A model of type T based on the provided parameters.
   */
  buildModel<T>(
    name: string,
    schema: {
      definition?:
        | SchemaDefinition
        | ApplySchemaOptions<
            ObtainDocumentType<any, any, ResolveSchemaOptions<SchemaOptions>>,
            ResolveSchemaOptions<SchemaOptions>
          >
        | {};
      options?: SchemaOptions | ResolveSchemaOptions<SchemaOptions>;
    },
    collection?: string,
    options?: CompileModelOptions
  ): Model<T> {
    return this.conn.model<T>(
      name,
      new this.getSchema(schema.definition, schema.options),
      collection,
      options
    );
  }

  /**
   * Asynchronously retrieves a list of collection names from the database.
   * @returns {Promise<string[]>} A promise that resolves to an array of collection names sorted alphabetically.
   */
  async listCollections(): Promise<string[]> {
    return (await this.conn.db.listCollections().toArray())
      .filter((collections) => collections.type === "collection")
      .map((collections) => collections.name)
      .sort();
  }

  /**
   * Retrieves information about a collection from the database.
   * @param {string} collection - The name of the collection to retrieve information for.
   * @param {collectionInfoOptions} [options={}] - Additional options for retrieving collection information.
   * @returns {Promise<Array<CollectionInfo>>} A promise that resolves to an array of CollectionInfo objects.
   */
  async collectionInfo(
    collection: string,
    options: collectionInfoOptions = {}
  ): Promise<Array<CollectionInfo>> {
    const { subColumn, match } = options;
    const collectionKey =
      subColumn && typeof subColumn === "string"
        ? `$$ROOT.${subColumn}`
        : "$$ROOT";

    return await processCollectionInfo(
      this.conn,
      collection,
      collectionKey,
      match
    );
  }
}
