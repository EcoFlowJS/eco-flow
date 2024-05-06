import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Toggle the active status of a user based on the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 * @throws Throws an error if userID or isActiveUser is undefined.
 */
const toggleUser = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { userID } = ctx.params;

  /**
   * Throws an error if the userID is undefined.
   * @param {any} userID - The user ID to check for undefined.
   * @throws {string} Throws an error message if userID is undefined.
   */
  if (_.isUndefined(userID)) throw "userID is undefined.";

  /**
   * Updates the user's isActive status based on the request body and logs the action.
   * @param {Object} ctx - The context object containing the request body and user information.
   * @param {string} userID - The ID of the user to update.
   * @param {Object} service - An object containing UserService and AuditLogsService.
   * @returns None
   * @throws {string} Throws an error if isActiveUser is undefined.
   */
  try {
    const { isActiveUser } = ctx.request.body;
    if (_.isUndefined(isActiveUser)) throw "isActiveUser is undefined.";

    /**
     * Updates the user's isActive status in the UserService and logs the action in the AuditLogsService.
     * @param {string} userID - The ID of the user to update.
     * @param {boolean} isActiveUser - The new isActive status for the user.
     * @returns None
     */
    const { UserService, AuditLogsService } = service;
    await UserService.upddateUser(
      userID,
      {
        isActive: isActiveUser,
      },
      true
    );

    /**
     * Sets the response body with a success message and user status based on the isActiveUser flag.
     * @param {boolean} isActiveUser - Flag indicating if the user is active or not.
     * @returns None
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: {
        msg: `User successfully ${isActiveUser ? "Enabled" : "Disabled"}`,
        isActive: isActiveUser,
      },
    };

    /**
     * Add a log entry to the audit logs service.
     * @param {Object} logData - The data object containing log information.
     * @param {string} logData.message - The message to be logged, including user ID and action.
     * @param {string} logData.type - The type of log entry (e.g., Info, Error, Warning).
     * @param {string} logData.userID - The ID of the user performing the action.
     * @returns Promise<void>
     */
    await AuditLogsService.addLog({
      message: `User(${userID}) successfully ${
        isActiveUser ? "Enabled" : "Disabled"
      }`,
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

export default toggleUser;
