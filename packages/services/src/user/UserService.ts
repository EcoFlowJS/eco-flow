import {
  Database,
  DatabaseConnection,
  UserService as IUserService,
} from "@eco-flow/types";
import { userModelMongoose } from "./model/userModel";
import { Schema } from "mongoose";

const schema = new Schema({
  name: String,
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

export class UserService implements IUserService {
  private dataBase: Database;
  private connection: DatabaseConnection;

  constructor() {
    this.dataBase = ecoFlow.database;
    this.connection = this.dataBase.getDatabaseConnection("mongo24");
  }

  async isNoUser(): Promise<boolean> {
    if (this.dataBase.isMongoose(this.connection)) {
      console.log(await userModelMongoose(this.connection).countDocuments());
    }

    return false;
  }
}
