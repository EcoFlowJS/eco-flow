import { DriverKnex, DriverMongoose, Knex } from "./drivers";

export interface Database {
  createConnections: (
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ) => void;
  initConnection: () => Promise<void>;
  getDatabaseConnection: (name: string) => void;
  removeDatabaseConnection: (name: string) => void;
  updateDatabaseConnection: (
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ) => void;
}

export type DB_Drivers = "MYSQL" | "PGSQL" | "SQLLite" | "MONGO";
// export interface DriverDB<InstanceType extends {} = any> extends Function {
//   new (...args: any[]): InstanceType;
//   prototype: InstanceType;
// }

export interface DatabaseConnection {
  [key: string]: DriverKnex | DriverMongoose;
}

export interface DatabaseConnectionConfig {
  name: string;
  driver: DB_Drivers;
  connections: String | Knex.Config["connection"];
}

export interface ConnectionConfig {}
