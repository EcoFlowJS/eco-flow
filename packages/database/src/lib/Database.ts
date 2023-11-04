import { DB, Database as IDatabase } from "@eco-flow/types";
import knex from "knex";

export class Database implements IDatabase {
  DB!: DB;
  constructor() {}
}
