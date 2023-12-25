import { MongooseOptions } from "mongoose";
import { DriverKnex, DriverMongoose, Knex } from "./drivers";

export interface Database {
  initConnection(): Promise<void>;
  getDatabaseConnection(name: string): any;
  addDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<[boolean, string]>;
  removeDatabaseConnection(name: string): Promise<[boolean, String]>;
  updateDatabaseConnection(
    name: string,
    driver: DB_Drivers,
    connection: ConnectionConfig
  ): Promise<[boolean, string]>;
  isKnex(connection: any): connection is DriverKnex;
  isMongoose(connection: any): connection is DriverMongoose;
}

export type DB_Drivers = "MYSQL" | "PGSQL" | "SQLite" | "MONGO";

export type DatabaseConnection = DriverKnex | DriverMongoose;

export interface DatabaseConnectionConfig {
  name: string;
  driver?: DB_Drivers;
  connections?: ConnectionConfig;
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
