import Helper from "@ecoflow/helper";
import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Creates a new user with the provided information and handles error cases.
 * @param {Context} ctx - The context object containing the request information.
 * @returns None
 */
const createUser = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { username, name, password, email, roles } = ctx.request.body;

  if (_.isUndefined(username)) throw "username is required";
  if (_.isUndefined(name)) throw "name is required";
  if (_.isUndefined(password)) throw "password is required";

  /**
   * Try to create a new user with the provided information and handle any errors that may occur.
   * @param {object} service - An object containing UserService and AuditLogsService.
   * @param {string} username - The username of the new user.
   * @param {string} password - The password of the new user.
   * @param {string} name - The name of the new user.
   * @param {string} email - The email of the new user.
   * @param {string[]} roles - An array of roles for the new user.
   * @param {object} ctx - The context object containing information about the request.
   * @returns None
   */
  try {
    const { UserService, AuditLogsService } = service;
    if (await UserService.isUserExist(username)) throw "User already exists.";

    if (!Helper.validatePasswordRegex(password))
      throw "Password must have at least a symbol, upper and lower case letters and a number.";

    /**
     * Creates a new user with the provided information.
     * @param {Object} userData - An object containing user data including username, name, password, email, and roles.
     * @returns {Promise} A promise that resolves once the user is successfully created.
     */
    await UserService.createUser({
      username,
      name,
      password,
      email,
      roles,
    });

    /**
     * Sets the response body to an ApiResponse object with success set to true and a payload message.
     * @type {ApiResponse}
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: "User Created successful.",
    };

    /**
     * Adds a new log entry to the audit logs service.
     * @param {Object} logData - The data for the log entry.
     * @param {string} logData.message - The message for the log entry.
     * @param {string} logData.type - The type of the log entry (e.g., "Info", "Error").
     * @param {string} logData.userID - The ID of the user associated with the log entry.
     * @returns None
     */
    await AuditLogsService.addLog({
      message: `New user ${username} created by ${ctx.user}.`,
      type: "Info",
      userID: ctx.user,
    });
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default createUser;
