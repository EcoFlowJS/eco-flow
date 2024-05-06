import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Updates user information based on the provided context.
 * @param {Context} ctx - The context object containing the request information.
 * @returns None
 */
const updateUserInfo = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { userInfo, mode } = ctx.request.body;

  /**
   * Handles user information updates and password changes based on the specified mode.
   * @param {Object} service - An object containing UserService and AuditLogsService.
   * @param {Object} ctx - The context object containing user information.
   * @param {string} mode - The mode of operation ('info' for user info update, 'PWD' for password update).
   * @param {Object} userInfo - The user information object containing name, email, oldPassword, newPassword, and rePassword.
   * @returns None
   * @throws {string} Throws error messages for invalid parameters or mismatched passwords.
   */
  try {
    const { UserService, AuditLogsService } = service;
    ctx.status = 200;
    /**
     * Handles different modes of user updates such as updating user information or password.
     * @param {string} mode - The mode of update (info or PWD).
     * @param {object} userInfo - The user information object containing name, email, oldPassword, newPassword, and rePassword.
     * @param {object} ctx - The context object containing user information.
     * @returns None
     */
    switch (mode) {
      /**
       * Updates the user information with the provided name and email, sets the response body
       * to indicate success, and adds an audit log for the user info update.
       * @param {object} ctx - The context object containing user information.
       * @param {object} userInfo - The updated user information object with name and email.
       * @returns None
       */
      case "info":
        /**
         * Update the user information with the provided name and email.
         * @param {User} ctx.user - The user object to be updated.
         * @param {Object} userInfo - The object containing the new name and email information.
         * @param {string} userInfo.name - The new name of the user.
         * @param {string} userInfo.email - The new email of the user.
         * @returns None
         */
        await UserService.upddateUser(ctx.user, {
          name: userInfo.name,
          email: userInfo.email,
        });

        /**
         * Sets the response body to an ApiResponse object with a success status and a message.
         * @type {ApiResponse}
         * @property {boolean} success - Indicates if the operation was successful.
         * @property {string} payload - The message indicating the success of the operation.
         */
        ctx.body = <ApiResponse>{
          success: true,
          payload: "User info updated successfully.",
        };

        /**
         * Add a log entry to the audit logs service.
         * @param {Object} logData - The data object containing log information.
         * @param {string} logData.message - The message to be logged.
         * @param {string} logData.type - The type of log entry (e.g., "Info", "Error").
         * @param {string} logData.userID - The ID of the user associated with the log entry.
         * @returns {Promise} A promise that resolves when the log entry is successfully added.
         */
        await AuditLogsService.addLog({
          message: `User info updated successfully(SELF: ${ctx.user})`,
          type: "Info",
          userID: ctx.user,
        });
        break;

      /**
       * Handles the "PWD" case by updating the user's password and adding an audit log.
       * @param {object} userInfo - An object containing oldPassword, newPassword, and rePassword.
       * @param {object} ctx - The context object containing user information.
       * @throws {string} Throws an error if invalid parameters are passed or if the passwords do not match.
       * @returns None
       */
      case "PWD":
        /**
         * Updates the user's password based on the provided information.
         * @param {Object} userInfo - An object containing the user's old password, new password, and re-entered password.
         * @returns None
         * @throws {string} If invalid parameters are passed or if the new password and re-entered password do not match.
         */
        const { oldPassword, newPassword, rePassword } = userInfo;

        if (
          _.isEmpty(oldPassword) ||
          _.isEmpty(newPassword) ||
          _.isEmpty(rePassword)
        )
          throw "Invalid parameters passed";

        if (newPassword !== rePassword) throw "The two passwords do not match";

        /**
         * Update the password for the user.
         * @param {User} user - The user object for which the password is being updated.
         * @param {string} oldPassword - The old password of the user.
         * @param {string} newPassword - The new password to be set for the user.
         * @returns Promise<void>
         */
        await UserService.updatePassword(ctx.user, oldPassword, newPassword);

        /**
         * Sets the response body to an ApiResponse object with a success status and a message.
         * @param {ApiResponse} {
         * @param {boolean} success - The success status of the response.
         * @param {string} payload - The message to be included in the response.
         * @returns None
         */
        ctx.body = <ApiResponse>{
          success: true,
          payload: "Password updated successfully.",
        };

        /**
         * Add a log entry to the audit logs service indicating a successful password update.
         * @param {Object} logData - The data object containing the log information.
         * @param {string} logData.message - The message to be logged.
         * @param {string} logData.type - The type of log entry (e.g., "Info", "Error").
         * @param {string} logData.userID - The ID of the user for whom the password was updated.
         * @returns None
         */
        await AuditLogsService.addLog({
          message: `Password updated successfully for username ${ctx.user} (SELF: ${ctx.user})`,
          type: "Info",
          userID: ctx.user,
        });
        break;
      default:
        ctx.status = 409;
        ctx.body = <ApiResponse>{
          error: true,
          payload: "Invalid mode specified",
        };
        break;
    }
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default updateUserInfo;
