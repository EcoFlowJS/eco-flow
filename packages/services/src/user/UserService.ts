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
import { userModelKnex, userModelMongoose } from "./model/userModel.js";
import Helper from "@ecoflow/helper";
import { Types } from "mongoose";

/**
 * Represents a UserService class that implements the UserService interface.
 */
export class UserService implements IUserService {
  private dataBase: Database;
  private connection: DatabaseConnection;

  /**
   * Constructs a new instance of the class.
   * @param {DatabaseConnection} [conn] - Optional parameter for the database connection.
   * If not provided, it uses the default connection from ecoFlow database.
   * @returns None
   */
  constructor(conn?: DatabaseConnection) {
    this.dataBase = ecoFlow.database;
    this.connection = conn || this.dataBase.getDatabaseConnection("_sysDB");
  }

  /**
   * Checks if there are any users in the database.
   * @returns A Promise that resolves to a boolean indicating whether there are no users in the database.
   */
  async isNoUser(): Promise<boolean> {
    const { _ } = ecoFlow;

    /**
     * Checks if the connection is using Mongoose and if the user model count is 0.
     * @param {any} connection - The connection object to check.
     * @returns {boolean} Returns true if the connection is using Mongoose and the user model count is 0, otherwise false.
     */
    if (this.dataBase.isMongoose(this.connection))
      return (await userModelMongoose(this.connection).countDocuments()) === 0
        ? true
        : false;

    /**
     * Checks if the connection is using Knex, then executes a count query using userModelKnex
     * and returns true if the count is 0, otherwise false.
     * @param {any} connection - the database connection object
     * @returns {boolean} true if the count is 0, false otherwise
     */
    if (this.dataBase.isKnex(this.connection)) {
      const countQuery = (
        await (await userModelKnex(this.connection))().count()
      )[0];

      const count = !_.isUndefined(countQuery["count(*)"])
        ? countQuery["count(*)"]
        : countQuery.count;

      return Number(count) === 0 ? true : false;
    }

    return false;
  }

  /**
   * Checks if a user with the given userId exists in the database.
   * @param {string} userId - The id of the user to check for existence.
   * @returns {Promise<boolean>} A promise that resolves to true if the user exists, false otherwise.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async isUserExist(userId: string): Promise<boolean> {
    const { _ } = ecoFlow;
    /**
     * Checks if the connection is using Knex, then queries the user model to count the number of
     * records where the username matches the provided userId. Returns true if the count is greater
     * than 0, false otherwise.
     * @param {any} connection - the database connection object
     * @param {string} userId - the user ID to check for in the database
     * @returns {boolean} true if the count of records is greater than 0, false otherwise
     */
    if (this.dataBase.isKnex(this.connection)) {
      const countQuery = (
        await (await userModelKnex(this.connection))().count().where({
          username: userId,
        })
      )[0];
      const count = !_.isUndefined(countQuery["count(*)"])
        ? countQuery["count(*)"]
        : countQuery.count;
      return Number(count) > 0;
    }

    /**
     * Checks if the given connection is a Mongoose connection and then queries the user model
     * to check if a user with the given username exists.
     * @param {any} connection - The database connection to check.
     * @param {string} userId - The username of the user to check.
     * @returns {boolean} True if a user with the given username exists, false otherwise.
     */
    if (this.dataBase.isMongoose(this.connection))
      return (
        (await userModelMongoose(this.connection)
          .find({ username: userId })
          .countDocuments()) > 0
      );

    throw "Invalid database connection specified";
  }

  /**
   * Checks if a user is active based on the userId provided.
   * @param {string} userId - The id of the user to check for activity.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the user is active.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async isActiveUser(userId: string): Promise<boolean> {
    const { _ } = ecoFlow;
    /**
     * Checks if the user with the given userId is active in the database.
     * @param {string} userId - The id of the user to check.
     * @returns {boolean} True if the user is active, false otherwise.
     */
    if (this.dataBase.isKnex(this.connection)) {
      const countQuery = (
        await (await userModelKnex(this.connection))().count().where({
          username: userId,
          isActive: true,
        })
      )[0];
      const count = !_.isUndefined(countQuery["count(*)"])
        ? countQuery["count(*)"]
        : countQuery.count;
      return Number(count) > 0;
    }

    /**
     * Checks if the given user is active in the MongoDB database using Mongoose.
     * @param {string} userId - The username of the user to check.
     * @returns {boolean} True if the user is active, false otherwise.
     */
    if (this.dataBase.isMongoose(this.connection))
      return (
        (await userModelMongoose(this.connection)
          .find({ username: userId, isActive: true })
          .countDocuments()) > 0
      );

    throw "Invalid database connection specified";
  }

  /**
   * Migrates user information to the database based on the type of database connection.
   * If the connection is Mongoose, the user information is created using the userModelMongoose.
   * If the connection is Knex, the user information is inserted into the database after converting roles to a JSON string.
   * @param {userTableCollection} userInfo - The user information to migrate.
   * @returns {Promise<void>} A promise that resolves when the migration is complete.
   */
  async migrateUsers(userInfo: userTableCollection): Promise<void> {
    /**
     * If the connection is using Mongoose, create a new user model with the provided user information.
     * @param {any} connection - The database connection object.
     * @param {object} userInfo - The user information to create the new user with.
     * @returns None
     */
    if (this.dataBase.isMongoose(this.connection))
      await userModelMongoose(this.connection).create(userInfo);

    /**
     * Inserts user information into the database using Knex if the connection is Knex.
     * @param {any} userInfo - The user information to be inserted into the database.
     * @returns None
     */
    if (this.dataBase.isKnex(this.connection)) {
      userInfo.roles = JSON.stringify(userInfo.roles) as any;
      await (await userModelKnex(this.connection))().insert(userInfo);
    }
  }

  /**
   * Creates a new user with the provided user information.
   * @param {userTableCollection} userInfo - The user information object.
   * @param {boolean} [isAdmin=false] - Flag indicating if the user is an admin.
   * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse object.
   */
  async createUser(
    userInfo: userTableCollection,
    isAdmin = false
  ): Promise<ApiResponse> {
    userInfo.username = userInfo.username!.toLowerCase();
    userInfo.password = await Helper.createHash(userInfo.password);
    if (isAdmin) userInfo.isPermanent = true;

    try {
      /**
       * Checks if the user is an admin and if there are existing user credentials.
       * @param {boolean} isAdmin - Flag indicating if the user is an admin.
       * @returns {object} An object with error set to true and a payload message if user credentials already exist.
       */
      if (isAdmin && !(await this.isNoUser()))
        return {
          error: true,
          payload: "some User Credentials already exists.",
        };

      /**
       * If the connection is using Mongoose, map the roles to ObjectIds if needed and create a new user in the database.
       * @param {any} connection - The database connection object.
       * @param {any} userInfo - The user information object.
       * @returns None
       */
      if (this.dataBase.isMongoose(this.connection)) {
        userInfo.roles = userInfo.roles!.map((role) =>
          role instanceof Types.ObjectId ? role : new Types.ObjectId(role)
        );
        await userModelMongoose(this.connection).create(userInfo);
      }

      /**
       * Checks if the connection is using Knex, then stringifies the roles in userInfo
       * and inserts the userInfo into the database using Knex.
       * @param {any} connection - The connection to the database.
       * @param {object} userInfo - The user information object to insert into the database.
       * @returns None
       */
      if (this.dataBase.isKnex(this.connection)) {
        userInfo.roles = JSON.stringify(userInfo.roles) as any;
        await (await userModelKnex(this.connection))().insert(userInfo);
      }

      /**
       * Emits a "createdUser" event to the server socket with the usernames of all users.
       * @returns None
       */
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

  /**
   * Retrieves an array of usernames from the database based on the specified conditions.
   * @param {boolean} [isSystem=false] - Flag to indicate if the usernames are for system users.
   * @returns {Promise<string[]>} A promise that resolves to an array of usernames.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async getUsernames(isSystem: boolean = false): Promise<string[]> {
    /**
     * Retrieves usernames from the database based on the provided conditions.
     * If the connection is using Knex, it executes a query to select usernames.
     * If isSystem is false, it filters out usernames with isPermanent set to false.
     * @param {boolean} isSystem - Flag to determine if system usernames should be included.
     * @returns {string[]} An array of usernames retrieved from the database.
     */
    if (this.dataBase.isKnex(this.connection)) {
      const query = (await userModelKnex<UserInfo>(this.connection))().select(
        "username"
      );
      if (!isSystem)
        query.where({
          isPermanent: false,
        });

      const usernames = await query;

      return usernames.map((username) => username.username!);
    }

    /**
     * Retrieves usernames from the user model based on the provided conditions.
     * @param {boolean} isSystem - Flag to determine if system users should be included.
     * @returns {string[]} An array of usernames that match the specified conditions.
     */
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

  /**
   * Retrieves user information based on the provided username and isAll flag.
   * @param {string} [username] - The username to retrieve information for.
   * @param {boolean} [isAll=false] - Flag to indicate whether to retrieve all user information.
   * @returns {Promise<GetUserInfoSingle & GetUserInfo>} A promise that resolves to an object containing user information.
   * @throws {Error} If an error occurs during the retrieval process.
   */
  async getUserInfos(
    username?: string,
    isAll: boolean = false
  ): Promise<GetUserInfoSingle & GetUserInfo> {
    const { _ } = ecoFlow;
    try {
      const userInfo: GetUserInfoSingle | GetUserInfo = Object.create({});
      userInfo.isAvailable = false;
      const findQuerry = {
        ...(username ? { username: username.toLowerCase() } : {}),
        ...(isAll ? {} : { isActive: true }),
      };
      let user: userTableCollection[] = [];

      /**
       * Checks if the connection is using Mongoose and then finds users based on the provided query.
       * @param {any} connection - The database connection object.
       * @param {any} findQuery - The query to find users.
       * @returns The user object that matches the query.
       */
      if (this.dataBase.isMongoose(this.connection))
        user = await userModelMongoose(this.connection).find(findQuerry);

      /**
       * Checks if the connection is using Knex, then fetches user data from the database
       * and processes it before returning.
       * @param {any} connection - The database connection object.
       * @param {object} findQuery - The query object to find the user.
       * @returns {Promise<userTableCollection[]>} An array of user objects with roles processed.
       */
      if (this.dataBase.isKnex(this.connection)) {
        user = await (await userModelKnex(this.connection))()
          .select()
          .where(findQuerry);
        user = user.map((userInfo: userTableCollection) => {
          userInfo.roles = _.isArray(userInfo.roles)
            ? userInfo.roles
            : JSON.parse(userInfo.roles as unknown as string);
          return userInfo;
        });
      }

      /**
       * Updates the user information based on the provided user array and username.
       * If the user array is not empty, sets isAvailable to true and assigns the user
       * information to the userInfo object.
       * @param {Array} user - The array of user information.
       * @param {string} username - The username to check against the user array.
       * @param {Object} userInfo - The object containing user information to update.
       * @returns None
       */
      if (user.length > 0) {
        userInfo.isAvailable = true;
        userInfo.user = username ? user[0] : user;
      }

      return <GetUserInfoSingle & GetUserInfo>userInfo;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a user in the database with the provided username and update information.
   * @param {string} username - The username of the user to update.
   * @param {userTableCollection} update - The information to update for the user.
   * @param {boolean} [isIgnoreActive=false] - Flag to ignore the active status of the user.
   * @returns {Promise<UserInfo>} The updated user information.
   * @throws {string} Throws an error if username or update information is not provided.
   */
  async upddateUser(
    username: string,
    update: userTableCollection,
    isIgnoreActive: boolean = false
  ): Promise<UserInfo> {
    const { _, server } = ecoFlow;
    /**
     * Throws an error if the username is undefined.
     * @param {any} username - The username to check for undefined.
     * @throws {string} Throws an error message if the username is undefined.
     */
    if (_.isUndefined(username)) throw "Username is required";

    /**
     * Throws an error if the 'update' parameter is undefined.
     * @param {*} update - The update information to check.
     * @throws {string} Throws an error message if 'update' is undefined.
     */
    if (_.isUndefined(update)) throw "No update information is provided";

    /**
     * Updates user information in the database using Knex if the connection is Knex.
     * @param {object} update - The object containing the updated user information.
     * @param {string} username - The username of the user to update.
     * @param {boolean} isIgnoreActive - Flag to ignore the active status of the user.
     * @returns {object} The updated user object.
     */
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

    /**
     * Updates user information in the database using Mongoose if the connection is a Mongoose connection.
     * @param {object} update - The object containing the updated user information.
     * @param {string} username - The username of the user to update.
     * @param {boolean} isIgnoreActive - Flag to ignore the active status of the user.
     * @returns {Promise<UserInfo>} A promise that resolves to the updated user information.
     */
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

  /**
   * Asynchronously updates the password for a user.
   * @param {string} username - The username of the user.
   * @param {string} oldPassword - The old password of the user.
   * @param {string} password - The new password to set.
   * @param {boolean} [ignoreCheck=false] - Flag to ignore password checks.
   * @returns {Promise<UserInfo>} A promise that resolves to the updated user information.
   * @throws {string} If username, oldPassword, or password is undefined.
   * @throws {string} If the new password is the same as the current password.
   * @throws {string} If no user is found with the given username.
   * @throws {string} If the password is invalid.
   */
  async updatePassword(
    username: string,
    oldPassword: string,
    password: string,
    ignoreCheck: boolean = false
  ): Promise<UserInfo> {
    const { _ } = ecoFlow;
    /**
     * Throws an error if the username is undefined.
     * @param {any} username - The username to check for undefined.
     * @throws {string} Throws an error message if the username is undefined.
     */
    if (_.isUndefined(username)) throw "Username is required";

    /**
     * Throws an error if the old password is undefined.
     * @param {any} oldPassword - The old password to check.
     * @throws {string} Throws an error if the old password is undefined.
     */
    if (_.isUndefined(oldPassword)) throw "Old password is required";

    /**
     * Throws an error if the password is undefined.
     * @param {any} password - The password to check for undefined.
     * @throws {string} Throws an error message if the password is undefined.
     */
    if (_.isUndefined(password)) throw "New password is required";

    /**
     * Checks if the new password is the same as the old password and throws an error if they are the same.
     * @param {string} oldPassword - The current password.
     * @param {string} password - The new password to be set.
     * @throws {string} Throws an error if the new password is the same as the old password.
     */
    if (oldPassword === password)
      throw "New password is same as the current password";

    const { isAvailable, user } = await this.getUserInfos(username);

    /**
     * Throws an error if the user is not available.
     * @param {boolean} isAvailable - Indicates if the user is available.
     * @param {string} username - The username of the user.
     * @throws {string} Throws an error message if the user is not available.
     */
    if (!isAvailable) throw `No user found with username ${username}`;

    /**
     * Checks if the old password matches the password stored in the user table collection.
     * If the passwords do not match, an error is thrown.
     * @param {boolean} ignoreCheck - Flag to ignore the password check.
     * @param {string} oldPassword - The old password to compare.
     * @param {userTableCollection} user - The user object containing the password.
     * @throws {string} Throws an error message if the old password is invalid.
     */
    if (
      !ignoreCheck &&
      !(await Helper.compareHash(
        oldPassword,
        (<userTableCollection>user).password!
      ))
    )
      throw `Invalid old password.`;

    /**
     * Checks if the old password matches the user's last used password.
     * If the old password matches the last used password, it throws an error.
     * @param {boolean} ignoreCheck - Flag to ignore the password check.
     * @param {string} password - The new password to be set.
     * @param {userTableCollection} user - The user object containing the old password.
     * @throws {string} Throws an error if the old password matches the last used password.
     */
    if (
      !ignoreCheck &&
      !_.isEmpty((<userTableCollection>user).oldPassword) &&
      (await Helper.compareHash(
        password,
        (<userTableCollection>user).oldPassword!
      ))
    )
      throw "Last used password can't be update as new password. Please use another password";

    /**
     * Validates the password against a regex pattern.
     * Throws an error if the password does not meet the required criteria.
     * @param {string} password - The password to validate.
     * @throws {string} Password must have at least a symbol, upper and lower case letters and a number.
     */
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
