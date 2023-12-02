import { ClassType } from "../ecoflow";

export interface Database {
  initConnection: (name: string, driver: DatabaseDriver) => ClassType;
  getDatabaseConnection: (name: string) => ClassType;
  removeDatabaseConnection: (name: string) => void;
  updateDatabaseConnection: (name: string, driver: DatabaseDriver) => void;
}

export type DatabaseDriver = "knex";
export type DatabaseConnection = Map<string, ClassType>;
