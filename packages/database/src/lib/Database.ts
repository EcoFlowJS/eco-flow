import { Database as IDatabase, DB_Drivers } from "@eco-flow/types";

export class Database implements IDatabase {
  private async saveConfigurations(): Promise<void> {}

  private async getConfigurations(): Promise<void> {}

  private processENVs(): string {
    throw new Error("Not implemented yet");
  }

  createConnections(name: string, driver: DB_Drivers) {}

  async initConnection(): Promise<void> {}

  getDatabaseConnection(name: string): void {}

  removeDatabaseConnection(name: string): void {}

  updateDatabaseConnection(name: string, driver: DB_Drivers) {}
}
