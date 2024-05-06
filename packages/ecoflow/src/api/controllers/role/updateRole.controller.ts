import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Updates the permissions of a role based on the provided context.
 * @param {Context} ctx - The context object containing the request information.
 * @returns None
 * @throws {string} If the permissions or role id are undefined, an error is thrown.
 */
const updateRole = async (ctx: Context) => {
  const { service, _ } = ecoFlow;

  /**
   * Updates the permissions for a role based on the provided id and permissions.
   * Adds an audit log for the role update.
   * @param {Object} ctx - The context object containing the request body and user information.
   * @returns None
   * @throws {string} If the id or permissions are undefined, throws an error message.
   */
  try {
    const { id, permissions } = ctx.request.body;

    /**
     * Checks if the id or permissions are undefined, and throws an error if they are.
     * @param {any} id - The id of the role.
     * @param {any} permissions - The permissions of the role.
     * @throws {string} Throws an error message if id or permissions are undefined.
     */
    if (_.isUndefined(id) || _.isUndefined(permissions))
      throw "Invalid permissions for role update";

    /**
     * Sets the status of the response to 200 and constructs a response body with ApiResponse structure.
     * @param {number} 200 - The HTTP status code for success.
     * @param {ApiResponse} - The structure of the response body containing success status and payload.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await service.RoleService.updateRole(id!, permissions!),
    };

    /**
     * Adds a log entry to the audit logs service.
     * @param {Object} logData - The data object containing log information.
     * @param {string} logData.message - The message to be logged.
     * @param {string} logData.type - The type of log entry (e.g., "Info", "Error").
     * @param {string} logData.userID - The user ID associated with the log entry.
     * @returns None
     */
    await service.AuditLogsService.addLog({
      message: `role with id ${id} has been updated`,
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

export default updateRole;
