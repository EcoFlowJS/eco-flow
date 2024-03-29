import {
  AlterSqliteColumn,
  DatabaseCreateEditModel,
  DatabaseTableTypes,
  DriverKnex,
  Knex,
  KnexDB_Driver,
} from "@ecoflow/types";

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

const processColumnBuilder = (
  type: DatabaseTableTypes | undefined,
  table: Knex.TableBuilder,
  columnData: DatabaseCreateEditModel
): Knex.ColumnBuilder | null => {
  const { textFormat, numberFormat, dateTimeFormat, columnName } = columnData;
  let columnBuilder: Knex.ColumnBuilder | null = null;
  switch (type) {
    case "string":
      if (textFormat === "text") columnBuilder = table.text(columnName);
      if (textFormat === "varchar") columnBuilder = table.string(columnName);
      break;

    case "integer":
      if (numberFormat === null) columnBuilder = table.integer(columnName);
      if (numberFormat === "int") columnBuilder = table.integer(columnName);
      if (numberFormat === "bigInt") columnBuilder = table.bigint(columnName);
      if (numberFormat === "dec") columnBuilder = table.decimal(columnName);
      if (numberFormat === "float") columnBuilder = table.float(columnName);
      break;

    case "boolean":
      columnBuilder = table.boolean(columnName);
      break;

    case "datetime":
      if (dateTimeFormat === null) columnBuilder = table.datetime(columnName);
      if (dateTimeFormat === "date") columnBuilder = table.date(columnName);
      if (dateTimeFormat === "datetime")
        columnBuilder = table.datetime(columnName);
      if (dateTimeFormat === "time") columnBuilder = table.time(columnName);
      break;

    case "json":
      columnBuilder = table.json(columnName);
      break;
  }
  return columnBuilder;
};

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
