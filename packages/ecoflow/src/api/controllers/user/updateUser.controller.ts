import { ApiResponse, UserInfo } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Updates user information based on the provided context.
 * @param {Context} ctx - The context object containing information about the user update.
 * @returns None
 */
const updateUser = async (ctx: Context) => {
  const { _, service } = ecoFlow;

  /**
   * Destructures the userID from the params object in the context.
   * @param {object} ctx - The context object containing parameters.
   * @returns The userID extracted from the params object.
   */
  const { userID } = ctx.params;
  /**
   * Destructures the properties 'username', 'name', 'password', 'email', and 'roles' from the request body of the context object.
   * @param {Object} ctx - The context object containing the request body.
   * @returns None
   */

  const { username, name, password, email, roles } = ctx.request.body;

  /**
   * Updates user information based on the provided data and logs the action in the audit logs.
   * @param {string} userID - The ID of the user to update.
   * @param {string} username - The new username for the user.
   * @param {string} name - The new name for the user.
   * @param {string} email - The new email for the user.
   * @param {string[]} roles - The new roles for the user.
   * @param {string} password - The new password for the user.
   * @param {Object} service - An object containing UserService and AuditLogsService.
   * @param {Object} ctx - The context object for the request.
   * @returns None
   */
  try {
    /**
     * Validates the userID, username, and name parameters to ensure they are not empty.
     * Throws an error if any of the parameters are empty.
     * @param {any} userID - The user ID to validate.
     * @param {string} username - The username to validate.
     * @param {string} name - The name to validate.
     * @throws {string} Throws an error message if any of the parameters are empty.
     */
    if (_.isUndefined(userID)) throw "userID is empty";
    if (_.isEmpty(username)) throw "username is empty";
    if (_.isEmpty(name)) throw "name is empty";

    const { UserService, AuditLogsService } = service;

    /**
     * Updates the user information based on the provided username and user ID.
     * @param {UserInfo} userUpdates - The object containing the user information updates.
     * @param {string} userID - The user ID to compare with the username.
     * @param {string} username - The username to check and update.
     * @throws {string} Throws an error if the user already exists.
     * @returns None
     */
    const userUpdates: UserInfo = Object.create({});
    if (userID !== username.trim().toLowerCase()) {
      if (await UserService.isUserExist(username)) throw "User already exists";
      userUpdates.username = username;
    }

    userUpdates.name = name;
    userUpdates.email = email;
    userUpdates.roles = roles;

    /**
     * Update user information in the database.
     * @param {string} userID - The ID of the user to update.
     * @param {object} userUpdates - The updates to apply to the user.
     * @returns A promise that resolves when the user information is successfully updated.
     */
    await UserService.upddateUser(userID, userUpdates);

    /**
     * Updates the password for a user if the password is not undefined and not empty.
     * @param {string} userID - The ID of the user whose password is being updated.
     * @param {string} password - The new password to set for the user.
     * @returns None
     */
    if (!_.isUndefined(password) && !_.isEmpty(password))
      await UserService.updatePassword(userID, "", password, true);

    /**
     * Sets the response body to an ApiResponse object with success true and a payload message.
     * @type {ApiResponse}
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: "User updated successfully.",
    };

    /**
     * Add a log entry to the audit logs service.
     * @param {Object} logData - The data object containing log information.
     * @param {string} logData.message - The message to be logged.
     * @param {string} logData.type - The type of log entry (e.g., "Info", "Error").
     * @param {string} logData.userID - The ID of the user performing the action.
     * @returns None
     */
    await AuditLogsService.addLog({
      message: `User(${userID}) updated successfully by ${ctx.user}.`,
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

export default updateUser;
