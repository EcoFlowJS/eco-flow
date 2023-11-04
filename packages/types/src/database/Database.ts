import knex from "knex";

export interface Database {}

export interface DB {
  [key: string]: knex.Knex;
}
