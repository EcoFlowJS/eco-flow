import {
  Database as IDatabase,
  DatabaseConnection,
  DatabaseDriver,
  ClassType,
} from "@eco-flow/types";

export class Database implements IDatabase {
  private connections: DatabaseConnection = new Map<string, ClassType>();

  initConnection(name: string, driver: DatabaseDriver = "knex"): ClassType {
    switch (driver) {
      case "knex":
        this.connections.set(name, require("../drivers").DriverKnex);
        break;
    }

    return this.connections.get(name)!;
  }

  getDatabaseConnection(name: string): ClassType {
    return this.connections.get(name)!;
  }

  removeDatabaseConnection(name: string): void {
    this.connections.delete(name);
  }

  updateDatabaseConnection(name: string, driver: DatabaseDriver = "knex") {}
}
