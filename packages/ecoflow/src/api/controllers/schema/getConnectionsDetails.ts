import Helper from "@eco-flow/helper";
import {
  ConnectionConfig,
  ConnectionDefinations,
  DB_Drivers,
} from "@eco-flow/types";
import _ from "lodash";
import fse from "fs-extra";
import path from "path";

const getConnectionsDetails = (
  connections: ConnectionDefinations
): [string, DB_Drivers, ConnectionConfig] => {
  const name = Helper.xssFilterHelper(connections.ConnectionName);
  let Driver: DB_Drivers;
  let Connections: ConnectionConfig = {};
  switch (connections.dbDriver) {
    case "MongoDB":
      if (_.isEmpty(connections.mongoConnectionString))
        throw "MongoDB connection strinng is required";
      if (
        !connections.mongoConnectionString.startsWith("env(") &&
        !connections.mongoConnectionString.endsWith(")") &&
        !connections.mongoConnectionString.startsWith("mongodb://") &&
        !connections.mongoConnectionString.startsWith("mongodb+srv://")
      )
        throw "Invalid MongoDB URI provided in MongoDB connection string";
      Driver = "MONGO";
      Connections.connectionString = Helper.xssFilterHelper(
        connections.mongoConnectionString
      );
      break;
    case "MySQL":
      if (_.isEmpty(connections.Host)) throw "Mysql host is required";
      if (!_.isNumber(connections.Port)) throw "Mysql port must be a number";
      if (connections.Port < 1 && connections.Port > 65535)
        throw "Mysql port must be between 1 and 65535";
      if (_.isEmpty(connections.Username)) throw "Mysql username is required";
      if (_.isEmpty(connections.Database)) throw "Mysql database is required";
      Driver = "MYSQL";
      Connections.host = Helper.xssFilterHelper(connections.Host);
      Connections.port = connections.Port;
      Connections.user = Helper.xssFilterHelper(connections.Username);
      Connections.password = Helper.xssFilterHelper(connections.Password);
      Connections.database = Helper.xssFilterHelper(connections.Database);
      Connections.ssl = connections.isSSL;
      break;
    case "PostgreSQL":
      if (_.isEmpty(connections.Host)) throw "PostgreSQL host is required";
      if (!_.isNumber(connections.Port))
        throw "PostgreSQL port must be a number";
      if (connections.Port < 1 && connections.Port > 65535)
        throw "PostgreSQL port must be between 1 and 65535";
      if (_.isEmpty(connections.Username))
        throw "PostgreSQL username is required";
      if (_.isEmpty(connections.Database))
        throw "PostgreSQL database is required";
      Driver = "PGSQL";
      Connections.host = Helper.xssFilterHelper(connections.Host);
      Connections.port = connections.Port;
      Connections.user = Helper.xssFilterHelper(connections.Username);
      Connections.password = Helper.xssFilterHelper(connections.Password);
      Connections.database = Helper.xssFilterHelper(connections.Database);
      Connections.ssl = connections.isSSL;
      break;
    case "Sqlite":
      if (_.isEmpty(connections.SqliteFileLoc))
        throw "Sqlite file location is required";
      fse.ensureDirSync(Helper.xssFilterHelper(connections.SqliteFileLoc));
      if (_.isEmpty(connections.SqliteFileName))
        throw "Sqlite file name is required";
      if (
        !Helper.xssFilterHelper(connections.SqliteFileName).endsWith(".sqlite")
      )
        connections.SqliteFileName =
          Helper.xssFilterHelper(connections.SqliteFileName) + ".sqlite";
      const fileName = path.join(
        Helper.xssFilterHelper(connections.SqliteFileLoc),
        Helper.xssFilterHelper(connections.SqliteFileName)
      );
      Driver = "SQLite";
      Connections.filename = fileName;
      break;
    default:
      Driver = "SQLite";
      Connections.filename = path.join(
        ecoFlow.config._config.DB_Directory!,
        "UserSqlite",
        `${name}.sqlite`
      );
  }

  return [name, Driver, Connections];
};

export default getConnectionsDetails;
