import { DriverKnex, DriverMongoose, Knex } from "./drivers";

export interface Database {
  createConnections: (
    driver: DB_Drivers,
    con: String | ConnectionConfig
  ) => Promise<[boolean, DriverKnex | DriverMongoose | null]>;
  initConnection: () => Promise<void>;
  getDatabaseConnection: (name: string) => void;
  addDatabaseConnection: (
    name: string,
    driver: DB_Drivers,
    connection: String | ConnectionConfig
  ) => void;
  removeDatabaseConnection: (name: string) => void;
  updateDatabaseConnection: (
    name: string,
    driver: DB_Drivers,
    connection: String | ConnectionConfig
  ) => void;
}

export type DB_Drivers = "MYSQL" | "PGSQL" | "SQLite" | "MONGO";
// export interface DriverDB<InstanceType extends {} = any> extends Function {
//   new (...args: any[]): InstanceType;
//   prototype: InstanceType;
// }

export type DatabaseConnection = DriverKnex | DriverMongoose;

export interface DatabaseConnectionConfig {
  name: string;
  driver: DB_Drivers;
  connections: String | ConnectionConfig;
}

export interface ConnectionConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  ssl?: boolean;
  filename?: string;
  flags?: Array<any>;
}
