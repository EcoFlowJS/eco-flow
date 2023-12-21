import { Database as IDatabase, DB_Drivers } from "@eco-flow/types";

export class Database implements IDatabase {
  createConnections(name: string, driver: DB_Drivers) {}

  initConnection() {}

  getDatabaseConnection(name: string): void {}

  removeDatabaseConnection(name: string): void {}

  updateDatabaseConnection(name: string, driver: DB_Drivers) {}
}
