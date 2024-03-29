import {
  ApiResponse,
  Database,
  DatabaseConnection,
  GetUserInfo,
  GetUserInfoSingle,
  UserService as IUserService,
  UserInfo,
  userTableCollection,
} from "@ecoflow/types";
import { userModelKnex, userModelMongoose } from "./model/userModel";
import Helper from "@ecoflow/helper";
import { Types } from "mongoose";

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
        Number(
          (await (await userModelKnex(this.connection))().count())[0][
            "count(*)"
          ]
        ) > 0
      )
        response = false;
    }

    return response;
  }

  async isUserExist(userId: string): Promise<boolean> {
    if (this.dataBase.isKnex(this.connection)) {
      return (
        Number(
          (
            await (await userModelKnex(this.connection))().count().where({
              username: userId,
            })
          )[0]["count(*)"]
        ) > 0
      );
    }

    if (this.dataBase.isMongoose(this.connection))
      return (
        (await userModelMongoose(this.connection)
          .find({ username: userId })
          .countDocuments()) > 0
      );

    throw "Invalid database connection specified";
  }

  async isActiveUser(userId: string): Promise<boolean> {
    if (this.dataBase.isKnex(this.connection)) {
      return (
        Number(
          (
            await (await userModelKnex(this.connection))().count().where({
              username: userId,
              isActive: true,
            })
          )[0]["count(*)"]
        ) > 0
      );
    }

    if (this.dataBase.isMongoose(this.connection))
      return (
        (await userModelMongoose(this.connection)
          .find({ username: userId, isActive: true })
          .countDocuments()) > 0
      );

    throw "Invalid database connection specified";
  }

  async createUser(
    userInfo: userTableCollection,
    isAdmin = false
  ): Promise<ApiResponse> {
    userInfo.username = userInfo.username!.toLowerCase();
    userInfo.password = await Helper.createHash(userInfo.password);
    if (isAdmin) userInfo.isPermanent = true;

    try {
      if (isAdmin && !(await this.isNoUser()))
        return {
          error: true,
          payload: "some User Credentials already exists.",
        };

      if (this.dataBase.isMongoose(this.connection)) {
        userInfo.roles = userInfo.roles!.map((role) =>
          role instanceof Types.ObjectId ? role : new Types.ObjectId(role)
        );
        await userModelMongoose(this.connection).create(userInfo);
      }

      if (this.dataBase.isKnex(this.connection)) {
        userInfo.roles = JSON.stringify(userInfo.roles) as any;
        await (await userModelKnex(this.connection))().insert(userInfo);
      }

      ecoFlow.server.socket.emit("createdUser", await this.getUsernames());
      return {
        success: true,
        payload: "User Credentials created successfully.",
      };
    } catch (error) {
      return {
        error: true,
        payload: error,
      };
    }
  }

  async getUsernames(isSystem: boolean = false): Promise<string[]> {
    if (this.dataBase.isKnex(this.connection)) {
      const query = (await userModelKnex<UserInfo>(this.connection))().select();
      if (!isSystem)
        query.where({
          isPermanent: false,
        });

      const usernames = await query.returning("username");

      return usernames.map((username) => username.username!);
    }

    if (this.dataBase.isMongoose(this.connection))
      return (
        await userModelMongoose<UserInfo>(this.connection).find(
          isSystem
            ? {}
            : {
                isPermanent: false,
              },
          "username"
        )
      ).map((username) => username.username!);

    throw "Invalid database connection specified";
  }

  async getUserInfos(
    username?: string,
    isAll: boolean = false
  ): Promise<GetUserInfoSingle & GetUserInfo> {
    try {
      const userInfo: GetUserInfoSingle | GetUserInfo = Object.create({});
      userInfo.isAvailable = false;
      const findQuerry = {
        ...(username ? { username: username.toLowerCase() } : {}),
        ...(isAll ? {} : { isActive: true }),
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

      return <GetUserInfoSingle & GetUserInfo>userInfo;
    } catch (error) {
      throw error;
    }
  }

  async upddateUser(
    username: string,
    update: userTableCollection,
    isIgnoreActive: boolean = false
  ): Promise<UserInfo> {
    const { _, server } = ecoFlow;
    if (_.isUndefined(username)) throw "Username is required";
    if (_.isUndefined(update)) throw "No update information is provided";

    if (this.dataBase.isKnex(this.connection)) {
      update.updated_at = this.connection.functionHelper.now();
      if (!_.isUndefined(update.roles))
        update.roles = JSON.stringify(update.roles) as any;

      const users = await (
        await userModelKnex<UserInfo>(this.connection)
      )()
        .update(update, "*")
        .where({
          username: username,
          ...(isIgnoreActive ? {} : { isActive: true }),
        });
      server.socket.emit("userUpdated");

      return users[0];
    }

    if (this.dataBase.isMongoose(this.connection)) {
      update.updated_at = new Date();
      if (!_.isUndefined(update.roles))
        update.roles = update.roles.map((role) => new Types.ObjectId(role));
      const users = <UserInfo>await userModelMongoose<UserInfo>(
        this.connection
      ).updateOne(
        {
          username: username,
          ...(isIgnoreActive ? {} : { isActive: true }),
        },
        {
          $set: {
            ...update,
          },
        },
        { new: true }
      );

      server.socket.emit("userUpdated");

      return users;
    }
    throw "Invalid database connection specified";
  }

  async updatePassword(
    username: string,
    oldPassword: string,
    password: string,
    ignoreCheck: boolean = false
  ): Promise<UserInfo> {
    const { _, server } = ecoFlow;
    if (_.isUndefined(username)) throw "Username is required";
    if (_.isUndefined(oldPassword)) throw "Old password is required";
    if (_.isUndefined(password)) throw "New password is required";

    if (oldPassword === password)
      throw "New password is same as the current password";

    const { isAvailable, user } = await this.getUserInfos(username);

    if (!isAvailable) throw `No user found with username ${username}`;

    if (
      !ignoreCheck &&
      !(await Helper.compareHash(
        oldPassword,
        (<userTableCollection>user).password!
      ))
    )
      throw `Invalid old password.`;

    if (
      !ignoreCheck &&
      !_.isEmpty((<userTableCollection>user).oldPassword) &&
      (await Helper.compareHash(
        password,
        (<userTableCollection>user).oldPassword!
      ))
    )
      throw "Last used password can't be update as new password. Please use another password";

    if (!Helper.validatePasswordRegex(password))
      throw "Password must have at least a symbol, upper and lower case letters and a number.";

    oldPassword = (<userTableCollection>user).password!;
    password = await Helper.createHash(password);

    return await this.upddateUser(username, {
      password,
      oldPassword,
    });
  }
}
