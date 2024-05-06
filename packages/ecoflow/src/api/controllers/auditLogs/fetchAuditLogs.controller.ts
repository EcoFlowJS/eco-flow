import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Fetches audit logs for a given page using the AuditLogsService.
 * @param {Context} ctx - The Koa context object.
 * @returns None
 */
const fetchAuditLogs = async (ctx: Context) => {
  /**
   * Try to fetch audit logs for a specific page using the AuditLogsService.
   * If successful, set the response body with the fetched audit logs.
   * If an error occurs, set the response status to 409 and return the error in the response body.
   * @param {object} ctx - The context object containing information about the request and response.
   * @returns None
   */
  try {
    const { AuditLogsService } = ecoFlow.service;
    const { page } = ctx.params;

    /**
     * Sets the response body with a success flag and the payload containing the audit logs fetched
     * from the AuditLogsService for the specified page.
     * @param {number} page - The page number for fetching audit logs.
     * @returns None
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: await AuditLogsService.fetchAuditLogs(page),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchAuditLogs;
