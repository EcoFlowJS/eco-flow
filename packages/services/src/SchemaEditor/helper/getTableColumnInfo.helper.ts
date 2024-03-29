import {
  DatabaseCreateEditModel,
  DatabaseTableAlias,
  DatabaseTableTypes,
  Knex,
  KnexDB_Driver,
} from "@ecoflow/types";

const textFormat = (type: any): DatabaseCreateEditModel["textFormat"] =>
  type === "varchar" || type === "character varying"
    ? "varchar"
    : type === "text"
    ? "text"
    : null;

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

const dateTimeFormat = (type: any): DatabaseCreateEditModel["dateTimeFormat"] =>
  type === "datetime" || type === "timestamp with time zone"
    ? "datetime"
    : type === "date"
    ? "date"
    : type === "time" || type === "time without time zone"
    ? "time"
    : null;

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
