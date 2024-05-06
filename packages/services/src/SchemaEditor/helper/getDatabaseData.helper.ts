import { CollectionInfo, DriverMongoose } from "@ecoflow/types";
import { Types } from "mongoose";

/**
 * Process the data from a MongoDB collection based on the provided information.
 * @param {DriverMongoose} connection - The Mongoose driver connection.
 * @param {string} collectionORtableName - The name of the collection or table.
 * @param {CollectionInfo} data - The information about the collection.
 * @param {any} [documentID=""] - The ID of the document to process.
 * @param {string} [parent=""] - The parent key if processing a nested object.
 * @returns {Object} - The processed values from the MongoDB collection.
 */
const processMongo = async (
  connection: DriverMongoose,
  collectionORtableName: string,
  data: CollectionInfo,
  documentID: any = "",
  parent = ""
) => {
  const values = Object.create({});
  /**
   * Asynchronously iterates over the keys in the data object and processes each key based on its type.
   * @param {Object} data - The data object containing keys and their types.
   * @param {Connection} connection - The MongoDB connection object.
   * @param {string} collectionORtableName - The name of the collection or table to process.
   * @param {string} documentID - The ID of the document to process.
   * @param {string} parent - The parent key if it exists.
   * @returns None
   */
  for await (const key of data.keys) {
    if (data.types[key] === "array" || data.types[key] === "object") {
      try {
        const result = await processMongo(
          connection,
          collectionORtableName,
          (
            await connection.collectionInfo(collectionORtableName, {
              subColumn: parent.length > 0 ? parent + "." + key : key,
              match: {
                _id:
                  documentID instanceof Types.ObjectId
                    ? documentID
                    : new Types.ObjectId(documentID),
              },
            })
          )[0],
          documentID,
          parent.length > 0 ? parent + "." + key : key
        );

        values[key] =
          data.types[key] === "array"
            ? Object.keys(result).map((key) => result[key])
            : result;
      } catch {
        continue;
      }
    } else if (data.types[key] === "binData") {
      values[key] = `Binary(${data.values[key]})`;
    } else if (data.types[key] === "date")
      values[key] = `Date(${
        data.values[key] instanceof Date
          ? (<Date>data.values[key]).toISOString()
          : data.values[key]
      })`;
    else if (data.types[key] === "decimal")
      values[key] = `MongoDecimal(${data.values[key]})`;
    else values[key] = data.values[key];
  }

  return values;
};

/**
 * Process data using MongoDB driver for the given collection or table name.
 * @param {DriverMongoose} connection - The MongoDB driver connection.
 * @param {string} collectionORtableName - The name of the collection or table.
 * @param {CollectionInfo[]} data - An array of data to process.
 * @returns {Promise<any>} A promise that resolves to the processed data.
 */
const dataProcessorMongo = async (
  connection: DriverMongoose,
  collectionORtableName: string,
  data: CollectionInfo[]
): Promise<any> => {
  const result = [];
  for await (const value of data) {
    const _id = value.values["_id"];
    result.push(
      await processMongo(connection, collectionORtableName, value, _id)
    );
  }
  return result;
};

export default dataProcessorMongo;
