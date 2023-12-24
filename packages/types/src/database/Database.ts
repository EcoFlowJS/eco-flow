import { MongooseOptions } from "mongoose";
import { DriverKnex, DriverMongoose, Knex } from "./drivers";

export interface Database {
  initConnection: () => Promise<void>;
  getDatabaseConnection: (name: string) => any;
  addDatabaseConnection: (
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ) => Promise<void>;
  removeDatabaseConnection: (name: string) => Promise<void>;
  updateDatabaseConnection: (
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ) => Promise<void>;
  isKnex(connection: any): boolean;
  isMongoose(connection: any): boolean;
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
  connections: ConnectionConfig;
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
  mongooseOptions?: MongooseOptions;
}
