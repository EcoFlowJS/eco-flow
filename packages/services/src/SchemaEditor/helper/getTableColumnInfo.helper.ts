import {
  DatabaseCreateEditModel,
  DatabaseTableAlias,
  DatabaseTableTypes,
  Knex,
  KnexDB_Driver,
} from "@ecoflow/types";

/**
 * Determines the text format based on the given database column type.
 * @param {any} type - The database column type to determine the text format for.
 * @returns {DatabaseCreateEditModel["textFormat"]} The text format for the given database column type.
 */
const textFormat = (type: any): DatabaseCreateEditModel["textFormat"] =>
  type === "varchar" || type === "character varying"
    ? "varchar"
    : type === "text"
    ? "text"
    : null;

/**
 * Determines the number format based on the given type.
 * @param {any} type - The type of the number.
 * @returns {DatabaseCreateEditModel["numberFormat"]} The corresponding number format.
 */
const numberFormat = (type: any): DatabaseCreateEditModel["numberFormat"] =>
  type === "int" || type === "integer"
    ? "int"
    : type === "bigint"
    ? "bigInt"
    : type === "decimal" || type === "numeric"
    ? "dec"
    : type === "float" || type === "real"
    ? "float"
    : null;

/**
 * Determines the appropriate date and time format based on the given type.
 * @param {any} type - The type of the date/time field.
 * @returns {DatabaseCreateEditModel["dateTimeFormat"]} The appropriate date and time format.
 */
const dateTimeFormat = (type: any): DatabaseCreateEditModel["dateTimeFormat"] =>
  type === "datetime" || type === "timestamp with time zone"
    ? "datetime"
    : type === "date"
    ? "date"
    : type === "time" || type === "time without time zone"
    ? "time"
    : null;

/**
 * Processes a given type and returns the corresponding DatabaseTableAlias or null.
 * @param {any} type - The type to process.
 * @returns {DatabaseTableAlias | null} The processed type as a DatabaseTableAlias or null if no match is found.
 */
const processTypeAlias = (type: any): DatabaseTableAlias | null =>
  type === "varchar" || type === "text" || type === "character varying"
    ? "Text"
    : type === "int" ||
      type === "bigint" ||
      type === "decimal" ||
      type === "float" ||
      type === "integer" ||
      type === "numeric" ||
      type === "real"
    ? "Number"
    : type === "datetime" ||
      type === "date" ||
      type === "time" ||
      type === "time without time zone" ||
      type === "timestamp with time zone"
    ? "Date"
    : type === "boolean" || type === "tinyint"
    ? "Boolean"
    : type === "json"
    ? "Json"
    : null;

/**
 * Processes the given type and returns the corresponding DatabaseTableTypes.
 * @param {any} type - The type to process.
 * @returns {DatabaseTableTypes | null} The processed type or null if no match is found.
 */
const processType = (type: any): DatabaseTableTypes | null =>
  type === "varchar" || type === "text" || type === "character varying"
    ? "string"
    : type === "int" ||
      type === "bigint" ||
      type === "decimal" ||
      type === "float" ||
      type === "integer" ||
      type === "numeric" ||
      type === "real"
    ? "integer"
    : type === "datetime" ||
      type === "date" ||
      type === "time" ||
      type === "time without time zone" ||
      type === "timestamp with time zone"
    ? "datetime"
    : type === "boolean" || type === "tinyint"
    ? "boolean"
    : type === "json"
    ? "json"
    : null;

/**
 * Retrieves the default value for a column based on the client and the provided default value.
 * @param {KnexDB_Driver} client - The Knex database driver.
 * @param {Knex.Value} defaultValue - The default value of the column.
 * @returns {Knex.Value} - The processed default value based on the client and input value.
 */
const getcolumnDefaultValue = (
  client: KnexDB_Driver,
  defaultValue: Knex.Value
): Knex.Value => {
  if (defaultValue === null) return "";
  if (typeof defaultValue === "string")
    if (client === "SQLite" && /^['"].*['"]/gm.test(defaultValue))
      return defaultValue.substring(1, defaultValue.length - 1);
  return defaultValue;
};

export {
  textFormat,
  numberFormat,
  dateTimeFormat,
  processTypeAlias,
  processType,
  getcolumnDefaultValue,
};
