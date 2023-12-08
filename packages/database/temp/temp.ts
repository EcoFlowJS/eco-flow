function getMySqlListProp(resp) {
  let vals = resp[0];
  if (!vals) return;

  return Object.keys(vals && vals[0])[0];
}

function getMySqlReturnValues(resp) {
  //console.log(resp);
  let prop = getMySqlListProp(resp);
  return prop && resp[0].map((it) => it[prop!]);
}

//refer to: http://troels.arvin.dk/db/rdbms/#cli-list_of_databases
function listDatabasesAsync(knex) {
  let dialect = knex.client.config.client;
  if (["mysql", "mysql2"].indexOf(dialect) > -1)
    return knex.raw("show databases").then(getMySqlReturnValues);

  if (dialect === "postgresql")
    return knex
      .select("datname")
      .from("pg_catalog.pg_database")
      .where("datistemplate", false)
      .where("datallowconn", true)
      .then((rst) => {
        return rst.map((it) => it.datname);
      });

  if (dialect === "mssql")
    return knex.raw("SP_HELPDB").then((rst) => {
      return rst
        .map((it) => it.name)
        .filter((it) => ["model", "tempdb", "master", "msdb"].indexOf(it) < 0); //exclude system dbs
    });
  else throw new Error(`${dialect} not supported`);
}

//refer to: http://troels.arvin.dk/db/rdbms/#cli-list_of_tables
function listTablesAsync(knex) {
  let dialect = knex.client.config.client;
  if (["mysql", "mysql2"].indexOf(dialect) > -1)
    return knex.raw("show tables").then(getMySqlReturnValues);

  if (dialect === "postgresql")
    return knex
      .select("tablename") //SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'
      .from("pg_catalog.pg_tables")
      .where("schemaname", "public")
      .then((rst) => rst.map((it) => it.tablename));

  if (dialect === "mssql")
    return knex
      .select("TABLE_NAME")
      .from("INFORMATION_SCHEMA.TABLES")
      .then((rst) => {
        return rst.map((it) => it["TABLE_NAME"]);
      });
  else throw new Error(`${dialect} not supported`);
}

module.exports = {
  listDatabasesAsync,
  listTablesAsync,
};
