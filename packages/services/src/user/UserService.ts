import {
  Database,
  DatabaseConnection,
  UserService as IUserService,
} from "@eco-flow/types";
import { userModelKnex, userModelMongoose } from "./model/userModel";
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
    this.connection = this.dataBase.getDatabaseConnection("_sysDB");
  }

  async isNoUser(): Promise<boolean> {
    let response = true;
    if (this.dataBase.isMongoose(this.connection))
      if ((await userModelMongoose(this.connection).countDocuments()) > 0)
        response = false;

    if (this.dataBase.isKnex(this.connection))
      if ((await userModelKnex(this.connection)) > 0) response = false;
    return response;
  }
}
