import { Knex } from "knex";
import { ApiResponse } from "../../ecoflow/index.js";

/**
 * Interface for UserService that defines various methods related to user management.
 */
export interface UserService {
  /**
   * Checks if there are any users in the database.
   * @returns A Promise that resolves to a boolean indicating whether there are no users in the database.
   */
  isNoUser(): Promise<boolean>;

  /**
   * Checks if a user with the given userId exists in the database.
   * @param {string} userId - The id of the user to check for existence.
   * @returns {Promise<boolean>} A promise that resolves to true if the user exists, false otherwise.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  isUserExist(userId: string): Promise<boolean>;

  /**
   * Checks if a user is active based on the userId provided.
   * @param {string} userId - The id of the user to check for activity.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the user is active.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  isActiveUser(userId: string): Promise<boolean>;

  /**
   * Migrates user information to the database based on the type of database connection.
   * If the connection is Mongoose, the user information is created using the userModelMongoose.
   * If the connection is Knex, the user information is inserted into the database after converting roles to a JSON string.
   * @param {userTableCollection} userInfo - The user information to migrate.
   * @returns {Promise<void>} A promise that resolves when the migration is complete.
   */
  migrateUsers(userInfo: userTableCollection): Promise<void>;

  /**
   * Creates a new user with the provided user information.
   * @param {userTableCollection} userInfo - The user information object.
   * @param {boolean} [isAdmin=false] - Flag indicating if the user is an admin.
   * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse object.
   */
  createUser(
    userInfo: userTableCollection,
    isAdmin?: boolean
  ): Promise<ApiResponse>;

  /**
   * Retrieves an array of usernames from the database.
   * @returns {Promise<string[]>} A promise that resolves to an array of usernames.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  getUsernames(): Promise<string[]>;

  /**
   * Retrieves an array of usernames from the database based on the specified conditions.
   * @param {boolean} [isSystem=false] - Flag to indicate if the usernames are for system users.
   * @returns {Promise<string[]>} A promise that resolves to an array of usernames.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  getUsernames(isSystem?: boolean): Promise<string[]>;

  /**
   * Retrieves user information.
   * @returns {Promise<GetUserInfo>} A promise that resolves to an object containing user information.
   * @throws {Error} If an error occurs during the retrieval process.
   */
  getUserInfos(): Promise<GetUserInfo>;

  /**
   * Retrieves user information based on the provided username.
   * @param {string} [username] - The username to retrieve information for.
   * @returns {Promise<GetUserInfoSingle>} A promise that resolves to an object containing user information.
   * @throws {Error} If an error occurs during the retrieval process.
   */
  getUserInfos(username?: string): Promise<GetUserInfoSingle>;

  /**
   * Retrieves user information based on the provided username and isAll flag.
   * @param {string} [username] - The username to retrieve information for.
   * @param {boolean} [isAll=false] - Flag to indicate whether to retrieve all user information.
   * @returns {Promise<GetUserInfoSingle & GetUserInfo>} A promise that resolves to an object containing user information.
   * @throws {Error} If an error occurs during the retrieval process.
   */
  getUserInfos(username?: string, isAll?: boolean): Promise<GetUserInfoSingle>;

  /**
   * Updates a user in the database with the provided username and update information.
   * @param {string} username - The username of the user to update.
   * @param {userTableCollection} update - The information to update for the user.
   * @returns {Promise<UserInfo>} The updated user information.
   * @throws {string} Throws an error if username or update information is not provided.
   */
  upddateUser(username: string, update: userTableCollection): Promise<UserInfo>;

  /**
   * Updates a user in the database with the provided username and update information.
   * @param {string} username - The username of the user to update.
   * @param {userTableCollection} update - The information to update for the user.
   * @param {boolean} [isIgnoreActive=false] - Flag to ignore the active status of the user.
   * @returns {Promise<UserInfo>} The updated user information.
   * @throws {string} Throws an error if username or update information is not provided.
   */
  upddateUser(
    username: string,
    update: userTableCollection,
    isIgnoreActive?: boolean
  ): Promise<UserInfo>;

  /**
   * Asynchronously updates the password for a user.
   * @param {string} username - The username of the user.
   * @param {string} oldPassword - The old password of the user.
   * @param {string} password - The new password to set.
   * @returns {Promise<UserInfo>} A promise that resolves to the updated user information.
   * @throws {string} If username, oldPassword, or password is undefined.
   * @throws {string} If the new password is the same as the current password.
   * @throws {string} If no user is found with the given username.
   * @throws {string} If the password is invalid.
   */
  updatePassword(
    username: string,
    oldPassword: string,
    password: string
  ): Promise<UserInfo>;

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
  updatePassword(
    username: string,
    oldPassword: string,
    password: string,
    ignoreCheck?: boolean
  ): Promise<UserInfo>;
}

/**
 * An interface representing an object with keys of type string and values of type boolean.
 */
interface AnyKeyBoolean {
  [key: string]: boolean;
}

/**
 * Interface representing user information.
 * @interface UserInfo
 * @property {string} [_id] - The unique identifier of the user.
 * @property {string} [name] - The name of the user.
 * @property {string} [username] - The username of the user.
 * @property {Array<any>} [roles] - An array of roles assigned to the user.
 * @property {boolean} [isActive] - Indicates if the user is active.
 * @property {string} [email] - The email address of the user.
 * @property {string} [oldPassword] - The old password of the user.
 * @property {boolean} [isPermanent] - Indicates if the user is permanent
 */
export interface UserInfo {
  _id?: string;
  name?: string;
  username?: string;
  roles?: Array<any>;
  isActive?: boolean;
  email?: string;
  oldPassword?: string;
  isPermanent?: boolean;
  created_at?: Date;
  updated_at?: Date | Knex.Raw;
}

/**
 * Interface for getting user information.
 * @interface GetUserInfo
 * @property {boolean} isAvailable - Indicates if user information is available.
 * @property {userTableCollection[]} [user] - An array of user information.
 */
export interface GetUserInfo {
  isAvailable: boolean;
  user?: userTableCollection[];
}

/**
 * Interface for getting user information.
 * @interface GetUserInfoSingle
 * @property {boolean} isAvailable - Indicates if user information is available.
 * @property {userTableCollection | undefined} user - The user information.
 */
export interface GetUserInfoSingle {
  isAvailable: boolean;
  user?: userTableCollection;
}

/**
 * Represents a collection of user table data with optional password field.
 * Extends the UserInfo interface.
 */
export interface userTableCollection extends UserInfo {
  password?: string;
}

/**
 * Interface representing user permissions with various boolean flags for different actions.
 * @interface UserPermissions
 * @extends AnyKeyBoolean
 */
export interface UserPermissions extends AnyKeyBoolean {
  createUser: boolean;
  deleteUser: boolean;
  updateUser: boolean;
  showUser: boolean;
  createRole: boolean;
  deleteRole: boolean;
  updateRole: boolean;
  serverConfigurationShow: boolean;
  serverConfigurationUpdate: boolean;
  stopServer: boolean;
  restartServer: boolean;
  createEnvs: boolean;
  deleteEnvs: boolean;
  updateEnvs: boolean;
  backup: boolean;
  restore: boolean;
  schemaEditor: boolean;
  createDBConnection: boolean;
  modifyDBConnection: boolean;
  removeDBConnection: boolean;
  createCollectionTable: boolean;
  modifyCollectionTable: boolean;
  removeCollectionTable: boolean;
  modifyDBStructure: boolean;
  displayDBRecord: boolean;
  insertDBRecord: boolean;
  modifyDBRecord: boolean;
  removeDBRecord: boolean;
  flowEditor: boolean;
  auditLogs: boolean;
  administrator: boolean;
}

/**
 * Interface representing user information.
 * @property {string} name - Name of the user.
 * @property {string} username - Username of the user.
 * @property {string} email - Email of the user.
 * @property {boolean} isPermanent - Is the user permanent or not.
 * @property {Date} - Date when the user is created.
 */
export interface UserInformations {
  name: string;
  username: string;
  email: string;
  isPermanent: boolean;
  createdAt: Date;
}
