import { DriverKnex, DriverMongoose } from "./drivers";

export interface Database {
  createConnections: (name: string, driver: DB_Drivers) => void;
  initConnection: () => Promise<void>;
  getDatabaseConnection: (name: string) => void;
  removeDatabaseConnection: (name: string) => void;
  updateDatabaseConnection: (name: string, driver: DB_Drivers) => void;
}

export type DB_Drivers = "MYSQL" | "PGSQL" | "SQLLite" | "MONGO";
// export interface DriverDB<InstanceType extends {} = any> extends Function {
//   new (...args: any[]): InstanceType;
//   prototype: InstanceType;
// }
