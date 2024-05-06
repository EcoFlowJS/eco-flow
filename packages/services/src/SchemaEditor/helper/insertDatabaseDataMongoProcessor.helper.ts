import mongoose from "mongoose";

/**
 * Processes the given data object and inserts it into a MongoDB database.
 * @param {any} data - The data object to be processed and inserted.
 * @returns The processed data object ready to be inserted into the database.
 */
const insertDatabaseDataMongoProcessor = (data: any) => {
  const { _ } = ecoFlow;
  if (_.isUndefined(data)) return {};
  if (_.isNull(data)) return null;

  /**
   * Recursively inserts database data using the Mongo processor for each value in the given object or array.
   * If the input data is an object, it iterates over each key and inserts the processed value.
   * If the input data is an array, it iterates over each element and inserts the processed value.
   * @param {any} data - The data to process and insert into the database.
   * @returns {any[]} - An array or object with the processed data inserted.
   */
  if (typeof data === "object") {
    if (Array.isArray(data)) {
      const result: any[] = [];
      data.map((_value, index) =>
        result.push(insertDatabaseDataMongoProcessor(data[index]))
      );
      return result;
    }
    const result = Object.create({});
    Object.keys(data).map(
      (key) => (result[key] = insertDatabaseDataMongoProcessor(data[key]))
    );
    return result;
  }

  /**
   * Checks if the input data is a string that starts with "Binary(" and ends with ")".
   * If the condition is met, it returns a Buffer containing the string "ROMEL" encoded in utf8.
   * @param {any} data - The data to be checked
   * @returns {Buffer | undefined} A Buffer containing "ROMEL" if the condition is met, otherwise undefined.
   */
  if (_.isString(data) && data.startsWith("Binary(") && data.endsWith(")"))
    return Buffer.from(data, "utf8");

  /**
   * Checks if the input data is a string and if the trimmed string is "Date()".
   * If the condition is met, it returns a new Date object.
   * @param {any} data - The data to be checked
   * @returns {Date | undefined} A new Date object if the condition is met, otherwise undefined.
   */
  if (_.isString(data) && data.trim() === "Date()") return new Date();

  /**
   * Parses a string data in the format "Date(...)" and returns a Date object.
   * @param {string} data - The string data to parse as a Date object.
   * @returns {Date} A Date object parsed from the input string data.
   */
  if (_.isString(data) && data.startsWith("Date(") && data.endsWith(")"))
    return new Date(data.substring("Date(".length, data.length - 1));

  /**
   * Parses a string data into a mongoose Decimal128 object if it is in the format "MongoDecimal(value)".
   * @param {string} data - The string data to parse into Decimal128.
   * @returns {mongoose.Types.Decimal128 | undefined} A Decimal128 object if the data is in the correct format, otherwise undefined.
   */
  if (
    _.isString(data) &&
    data.startsWith("MongoDecimal(") &&
    data.endsWith(")")
  )
    return new mongoose.Types.Decimal128(
      data.substring("MongoDecimal(".length, data.length - 1)
    );
  return data;
};

export default insertDatabaseDataMongoProcessor;
