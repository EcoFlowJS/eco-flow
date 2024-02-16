import {
  ApiResponse,
  Database,
  DatabaseConnection,
  UserService as IUserService,
  userTableCollection,
} from "@eco-flow/types";
import { userModelKnex, userModelMongoose } from "./model/userModel";
import Helper from "@eco-flow/helper";

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

    if (this.dataBase.isKnex(this.connection)) {
      if (
        (await (await userModelKnex(this.connection))().count())[0][
          "count(*)"
        ] > 0
      )
        response = false;
    }

    return response;
  }

  async createUser(
    userInfo: userTableCollection,
    isAdmin = false
  ): Promise<ApiResponse> {
    userInfo.password = await Helper.createHash(userInfo.password);
    if (isAdmin) userInfo.isPermanent = true;

    try {
      if (await this.isNoUser()) {
        if (this.dataBase.isMongoose(this.connection))
          await userModelMongoose(this.connection).create(userInfo);

        if (this.dataBase.isKnex(this.connection))
          await (await userModelKnex(this.connection))().insert(userInfo);

        return {
          success: true,
          payload: "User Credentials created successfully.",
        };
      }
      return {
        error: true,
        payload: "some User Credentials already exists.",
      };
    } catch (error) {
      return {
        error: true,
        payload: error,
      };
    }
  }
}
