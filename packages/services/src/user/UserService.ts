import {
  ApiResponse,
  Database,
  DatabaseConnection,
  GetUserInfo,
  UserService as IUserService,
  UserInfo,
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
    userInfo.username = userInfo.username!.toLowerCase();
    userInfo.password = await Helper.createHash(userInfo.password);
    if (isAdmin) userInfo.isPermanent = true;

    try {
      if (await this.isNoUser()) {
        if (this.dataBase.isMongoose(this.connection))
          await userModelMongoose(this.connection).create(userInfo);

        if (this.dataBase.isKnex(this.connection)) {
          userInfo.roles = JSON.stringify(userInfo.roles) as any;
          await (await userModelKnex(this.connection))().insert(userInfo);
        }

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

  async getUserAllInfo(username?: string): Promise<GetUserInfo> {
    try {
      const userInfo: GetUserInfo = Object.create({});
      userInfo.isAvailable = false;
      const findQuerry = {
        ...(username ? { username: username.toLowerCase() } : {}),
        isActive: true,
      };
      let user: userTableCollection[] = [];

      if (this.dataBase.isMongoose(this.connection))
        user = await userModelMongoose(this.connection).find(findQuerry);

      if (this.dataBase.isKnex(this.connection)) {
        user = await (await userModelKnex(this.connection))()
          .select()
          .where(findQuerry);
        user = user.map((userInfo: any) => {
          userInfo!.roles = JSON.parse(userInfo!.roles as unknown as string);
          return userInfo;
        });
      }

      if (user.length > 0) {
        userInfo.isAvailable = true;
        userInfo.user = username ? user[0] : user;
      }

      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  async upddateUser(
    username: string,
    update: userTableCollection
  ): Promise<UserInfo> {
    const { _, server } = ecoFlow;
    if (_.isUndefined(username)) throw "Username is required";
    if (_.isUndefined(update)) throw "No update information is provided";

    if (this.dataBase.isKnex(this.connection)) {
      update.updated_at = this.connection.functionHelper.now();
      if (!_.isUndefined(update.roles))
        update.roles = JSON.stringify(update.roles);

      const users = await (await userModelKnex<UserInfo>(this.connection))()
        .update(update, "*")
        .where({ username: username, isActive: true });
      server.socket.to(["users"]).emit("userUpdated");

      return users[0];
    }

    if (this.dataBase.isMongoose(this.connection)) {
      update.updated_at = new Date();
      const users = <UserInfo>await userModelMongoose<UserInfo>(
        this.connection
      ).updateOne(
        {
          username: username,
          isActive: true,
        },
        {
          $set: {
            ...update,
          },
        },
        { new: true }
      );

      server.socket.to(["users"]).emit("userUpdated");

      return users;
    }
    throw "Invalid database connection specified";
  }
}
