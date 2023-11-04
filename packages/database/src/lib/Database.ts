import { Database as IDatabase } from "@eco-flow/types";
import knex from "knex";

export class Database implements IDatabase {
  DB: knex.Knex;
  constructor() {
    this.DB = knex({
      client: "pg",
    });
  }
}
