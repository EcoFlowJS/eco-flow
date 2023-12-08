export interface Database {
  initConnection: (name: string, driver: DatabaseDriver) => DriverDB;
  getDatabaseConnection: (name: string) => DriverDB;
  removeDatabaseConnection: (name: string) => void;
  updateDatabaseConnection: (name: string, driver: DatabaseDriver) => void;
}

export type DatabaseDriver = "knex" | "mongoose";
export type DatabaseConnection = Map<string, DriverDB>;

export interface DriverDB<InstanceType extends {} = any> extends Function {
  new (...args: any[]): InstanceType;
  prototype: InstanceType;
}
