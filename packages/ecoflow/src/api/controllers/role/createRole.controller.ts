import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Creates a new role based on the provided role name and role-like object.
 * @param {Context} ctx - The Koa context object.
 * @returns None
 * @throws {Error} If there is an error during role creation.
 */
const createRole = async (ctx: Context) => {
  const { service } = ecoFlow;

  try {
    const { roleName, roleLike } = ctx.request.body;

    /**
     * Sets the status to 200 and constructs a response body with success status, payload
     * containing the result of creating a new role using the RoleService.
     * @param {string} roleName - The name of the role to be created.
     * @param {object} roleLike - An object containing role-related data.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await service.RoleService.createRole(
        { name: roleName },
        roleLike
      ),
    };

    /**
     * Adds a new log entry to the audit logs service.
     * @param {Object} logDetails - The details of the log entry.
     * @param {string} logDetails.message - The message to be logged.
     * @param {string} logDetails.type - The type of the log entry (e.g., "Info", "Error").
     * @param {string} logDetails.userID - The user ID associated with the log entry.
     * @returns Promise<void>
     */
    await service.AuditLogsService.addLog({
      message: `New role named ${roleName} has been created`,
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

export default createRole;
