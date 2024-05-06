import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Asynchronously removes a role using the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const removeRole = async (ctx: Context) => {
  const { service } = ecoFlow;

  /**
   * Removes a role with the given id and logs the action in the audit logs.
   * @param {Context} ctx - The Koa context object.
   * @returns None
   * @throws {Error} If there is an error during the removal process.
   */
  try {
    const { id } = ctx.params;

    /**
     * Sets the status to 200 and constructs a response body with success status and payload
     * @param {number} id - The id of the role to be removed
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await service.RoleService.removeRole(id!),
    };

    /**
     * Adds a log entry to the audit logs service.
     * @param {Object} logInfo - The information for the log entry.
     * @param {string} logInfo.message - The message to be logged.
     * @param {string} logInfo.type - The type of log entry (e.g., "Info", "Error").
     * @param {string} logInfo.userID - The user ID associated with the log entry.
     * @returns Promise<void>
     */
    await service.AuditLogsService.addLog({
      message: `Role with id ${id} has been removed`,
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

export default removeRole;
