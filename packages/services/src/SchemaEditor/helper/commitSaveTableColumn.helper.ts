import {
  AlterSqliteColumn,
  DatabaseCreateEditModel,
  DatabaseTableTypes,
  DriverKnex,
  Knex,
  KnexDB_Driver,
} from "@ecoflow/types";

/**
 * Process the table column based on the provided column data.
 * @param {Knex.ColumnBuilder} columnBuilder - The Knex column builder object.
 * @param {DatabaseCreateEditModel} columnData - The data for the column being processed.
 * @returns {Knex.ColumnBuilder} The updated Knex column builder object.
 */
const processTable = (
  columnBuilder: Knex.ColumnBuilder,
  columnData: DatabaseCreateEditModel
): Knex.ColumnBuilder => {
  const { _ } = ecoFlow;
  const { defaultValue, notNull } = columnData;
  if (!_.isUndefined(defaultValue) && defaultValue === null) {
    columnBuilder.defaultTo(null);
  }
  if (
    !_.isUndefined(defaultValue) &&
    defaultValue !== null &&
    defaultValue.toString().trim().length > 0
  ) {
    columnBuilder.defaultTo(defaultValue.toString().trim());
  }
  if (_.isBoolean(notNull) && notNull) {
    columnBuilder.notNullable();
  }

  return columnBuilder;
};

/**
 * Process the column builder based on the type and column data provided.
 * @param {DatabaseTableTypes | undefined} type - The type of the database table.
 * @param {Knex.TableBuilder} table - The Knex table builder object.
 * @param {DatabaseCreateEditModel} columnData - The data for creating or editing a column.
 * @returns {Knex.ColumnBuilder | null} The Knex column builder object or null.
 */
const processColumnBuilder = (
  type: DatabaseTableTypes | undefined,
  table: Knex.TableBuilder,
  columnData: DatabaseCreateEditModel
): Knex.ColumnBuilder | null => {
  const { textFormat, numberFormat, dateTimeFormat, columnName } = columnData;
  let columnBuilder: Knex.ColumnBuilder | null = null;
  /**
   * Builds and returns a column for a database table based on the given type and format.
   * @param {string} type - The data type of the column (string, integer, boolean, datetime, json).
   * @param {string} columnName - The name of the column.
   * @param {string} textFormat - The text format for string type (text, varchar).
   * @param {string} numberFormat - The number format for integer type (int, bigInt, dec, float).
   * @param {string} dateTimeFormat - The date time format for datetime type (date, datetime, time).
   * @returns The column builder for the specified type and format.
   */
  switch (type) {
    /**
     * Handles the case when the column type is a string.
     * Depending on the textFormat, it either creates a text or varchar column in the table.
     * @param {string} textFormat - The format of the text (either "text" or "varchar").
     * @param {string} columnName - The name of the column.
     * @param {TableBuilder} table - The table builder object.
     * @returns None
     */
    case "string":
      if (textFormat === "text") columnBuilder = table.text(columnName);
      if (textFormat === "varchar") columnBuilder = table.string(columnName);
      break;

    /**
     * Switch case for handling different number formats in a database table column.
     * @param {string} numberFormat - The format of the number (int, bigInt, dec, float).
     * @param {string} columnName - The name of the column in the table.
     * @param {Knex.TableBuilder} table - The Knex table builder object.
     * @returns None
     */
    case "integer":
      if (numberFormat === null) columnBuilder = table.integer(columnName);
      if (numberFormat === "int") columnBuilder = table.integer(columnName);
      if (numberFormat === "bigInt") columnBuilder = table.bigint(columnName);
      if (numberFormat === "dec") columnBuilder = table.decimal(columnName);
      if (numberFormat === "float") columnBuilder = table.float(columnName);
      break;

    /**
     * Build a boolean column for the table.
     * @param {string} columnName - The name of the column.
     * @returns The boolean column for the table.
     */
    case "boolean":
      columnBuilder = table.boolean(columnName);
      break;

    /**
     * Switch case for handling different datetime formats in a table column.
     * @param {string} dateTimeFormat - The format of the datetime column.
     * @param {string} columnName - The name of the column.
     * @param {Table} table - The table object to add the column to.
     * @returns None
     */
    case "datetime":
      if (dateTimeFormat === null) columnBuilder = table.datetime(columnName);
      if (dateTimeFormat === "date") columnBuilder = table.date(columnName);
      if (dateTimeFormat === "datetime")
        columnBuilder = table.datetime(columnName);
      if (dateTimeFormat === "time") columnBuilder = table.time(columnName);
      break;

    /**
     * Build a column for a table with JSON data type.
     * @param {string} columnName - The name of the column.
     * @returns The column builder for JSON data type.
     */
    case "json":
      columnBuilder = table.json(columnName);
      break;
  }
  return columnBuilder;
};

/**
 * Alters a column in a database table based on the provided parameters.
 * @param {KnexDB_Driver} client - The Knex database driver being used.
 * @param {string} oldColumnName - The name of the column to be altered.
 * @param {object} columnProcessor - An object containing information about the column to be altered.
 * @param {DatabaseTableTypes | undefined} columnProcessor.type - The type of the database table.
 * @param {Knex.CreateTableBuilder} columnProcessor.table - The Knex CreateTableBuilder object.
 * @param {DatabaseCreateEditModel} columnProcessor.columnData - The data for the column being altered.
 * @returns {AlterSqliteColumn | null} - An object containing information about the column to be altered.
 */
const alterColumn = (
  client: KnexDB_Driver,
  oldColumnName: string,
  columnProcessor: {
    type: DatabaseTableTypes | undefined;
    table: Knex.CreateTableBuilder;
    columnData: DatabaseCreateEditModel;
  }
): AlterSqliteColumn | null => {
  const { type, table, columnData } = columnProcessor;
  const { columnName } = columnData;

  if (client === "SQLite") return { oldColumnName, type: type!, columnData };

  let columnBuilder: Knex.ColumnBuilder | null = null;

  if (oldColumnName !== columnName)
    table.renameColumn(oldColumnName, columnName);

  columnBuilder = processColumnBuilder(type, table, {
    ...columnData,
    columnName: oldColumnName,
  });

  processTable(columnBuilder!, columnData!).alter();
  return null;
};

/**
 * Alter the columns of a SQLite table by dropping and adding new columns based on the provided details.
 * @param {DriverKnex} connection - The Knex connection to the SQLite database.
 * @param {string} tableName - The name of the table to alter.
 * @param {AlterSqliteColumn[]} sqliteColumnDetails - An array of objects containing details of columns to alter.
 * @returns None
 * @throws {string} If an invalid type is provided for columnBuilder.
 */
const alterSqliteColumn = async (
  connection: DriverKnex,
  tableName: string,
  sqliteColumnDetails: AlterSqliteColumn[]
) => {
  const existingData: any[] = await connection.queryBuilder(tableName).select();
  await connection.queryBuilder(tableName).delete();

  for await (const { type, oldColumnName, columnData } of sqliteColumnDetails) {
    await connection.schemaBuilder.alterTable(tableName, (table) => {
      table.dropColumn(oldColumnName);
    });

    await connection.schemaBuilder.alterTable(tableName, (table) => {
      const columnBuilder = processColumnBuilder(type, table, columnData);
      if (columnBuilder === null) throw "Invalid type provided";
      processTable(columnBuilder, columnData);

      existingData.map((result) => {
        const oldvalue = result[oldColumnName];
        delete result[oldColumnName];
        result[columnData.columnName] = oldvalue;
        return result;
      });
    });
  }

  await connection.queryBuilder(tableName).insert(existingData);
};

export { processTable, processColumnBuilder, alterColumn, alterSqliteColumn };
