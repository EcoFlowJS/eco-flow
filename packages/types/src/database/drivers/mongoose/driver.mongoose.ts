import mongoose, {
  Aggregate,
  ApplySchemaOptions,
  CompileModelOptions,
  ConnectOptions,
  Connection,
  Document,
  Model,
  ObtainDocumentType,
  Query,
  ResolveSchemaOptions,
  Schema,
  SchemaDefinition,
  SchemaOptions,
  SchemaType,
  VirtualType,
} from "mongoose";

/**
 * Interface for a Mongoose driver that provides access to various Mongoose functionalities.
 * @interface DriverMongoose
 */
export interface DriverMongoose {
  /**
   * Returns the Mongoose object for interacting with MongoDB using the Mongoose library.
   * @returns The Mongoose object.
   */
  get getMongoose(): typeof mongoose;

  /**
   * Returns the mongoose Schema class for creating MongoDB schemas.
   * @returns {typeof mongoose.Schema} The mongoose Schema class.
   */
  get getSchema(): typeof Schema;

  /**
   * Getter method to retrieve the mongoose connection object.
   * @returns {mongoose.Connection} The mongoose connection object.
   */
  get getConnection(): Connection;

  /**
   * Returns the type of mongoose Document.
   * @returns {typeof mongoose.Document} The type of mongoose Document.
   */
  get getDocument(): typeof Document;

  /**
   * Getter method that returns the Query class.
   * @returns The Query class.
   */
  get getQuery(): typeof Query;

  /**
   * Returns the Aggregate class.
   * @returns The Aggregate class.
   */
  get getAggregate(): typeof Aggregate;

  /**
   * Getter method that returns the SchemaType class.
   * @returns The SchemaType class
   */
  get getSchemaType(): typeof SchemaType;

  /**
   * Getter method that returns the VirtualType class.
   * @returns The VirtualType class.
   */
  get getVirtualType(): typeof VirtualType;

  /**
   * Creates a connection to a MongoDB database using Mongoose.
   * @param {string} uri - The URI of the MongoDB database.
   * @param {mongoose.ConnectOptions} [options] - Optional connection options.
   * @returns {Promise<Connection>} A promise that resolves to the Mongoose connection object.
   */
  createConnection(uri: string, options?: ConnectOptions): Promise<Connection>;

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
  ): Model<T>;

  /**
   * Asynchronously retrieves a list of collection names from the database.
   * @returns {Promise<string[]>} A promise that resolves to an array of collection names sorted alphabetically.
   */
  listCollections(): Promise<string[]>;

  /**
   * Retrieves information about a collection from the database.
   * @param {string} collection - The name of the collection to retrieve information for.
   * @returns {Promise<Array<CollectionInfo>>} A promise that resolves to an array of CollectionInfo objects.
   */
  collectionInfo(collection: string): Promise<Array<CollectionInfo>>;

  /**
   * Retrieves information about a collection from the database.
   * @param {string} collection - The name of the collection to retrieve information for.
   * @param {collectionInfoOptions} [options={}] - Additional options for retrieving collection information.
   * @returns {Promise<Array<CollectionInfo>>} A promise that resolves to an array of CollectionInfo objects.
   */
  collectionInfo(
    collection: string,
    options?: collectionInfoOptions
  ): Promise<Array<CollectionInfo>>;
}

/**
 * Interface representing information about a collection.
 * @interface CollectionInfo
 * @property {CollectionTypes[]} keys - An array of keys for the collection.
 * @property {Object.<string, CollectionTypes>} types - An object mapping keys to collection types.
 * @property {any} values - The values of the collection.
 */
export interface CollectionInfo {
  keys: CollectionTypes[];
  types: { [key: string]: CollectionTypes };
  values: any;
}

/**
 * Options for configuring collection information.
 * @interface collectionInfoOptions
 * @property {string} [subColumn] - The sub-column to use for collection.
 * @property {Object} [match] - An object containing key-value pairs to match against.
 */
export interface collectionInfoOptions {
  subColumn?: string;
  match?: { [key: string]: any };
}

/**
 * Represents the possible types that can be stored in a collection in MongoDB.
 * @typedef {CollectionTypes}
 * @type {string}
 * @enum {string}
 * @property {string} objectId - Represents an ObjectId type.
 * @property {string} array - Represents an Array type.
 * @property {string} binData - Represents a Binary Data type.
 * @property {string} bool - Represents a Boolean type.
 * @property {string} javascriptWithScope - Represents a JavaScript with Scope type.
 * @property {string} date - Represents a Date type.
 * @property {string} decimal - Represents a Decimal type.
 * @property {string} double - Represents a Double type.
 * @property {string} int - Represents a Integer type.
 * @property {string} long - Represents a Long type.
 * @property {string} maxKey - Represents a Max Key type.
 * @property {string} minKey - Represents a Min Key type.
 * @property {string} null - Represents a Null type.
 * @property {string} object - Represents a Object type.
 * @property {string} regex - Represents a RegExp type.
 * @property {string} string - Represents a String type.
 * @property {string} symbol - Represents a symbol type.
 * @property {string} timestamp - Represents a timestamp type.
 */
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

/**
 * Interface representing information about a database collection.
 * @property {CollectionTypes[]} keys - An array of collection types keys.
 * @property {Object.<string, CollectionTypes>} types - An object mapping keys to collection types.
 * @property {any} data - The data stored in the collection.
 */
export interface DatabaseCollectionInfo {
  keys: CollectionTypes[];
  types: {
    [key: string]: CollectionTypes;
  };
  data: any;
}
