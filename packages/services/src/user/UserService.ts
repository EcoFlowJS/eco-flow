import {
  Database,
  DatabaseConnection,
  UserService as IUserService,
} from "@eco-flow/types";
import { userModelKnex, userModelMongoose } from "./model/userModel";

export class UserService implements IUserService {
  private dataBase: Database;
  private connection: DatabaseConnection;

  constructor() {
    this.dataBase = ecoFlow.database;
    this.connection = this.dataBase.getDatabaseConnection("mongo24");
  }

  async isNoUser(): Promise<boolean> {
    let response = true;
    if (this.dataBase.isMongoose(this.connection))
      if ((await userModelMongoose(this.connection).countDocuments()) > 0)
        response = false;

    if (this.dataBase.isKnex(this.connection))
      if ((await userModelKnex(this.connection).count())[0]["count(*)"] > 0)
        response = false;
    return response;
  }
}
