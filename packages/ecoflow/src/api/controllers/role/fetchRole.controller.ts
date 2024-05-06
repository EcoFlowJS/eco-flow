import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Fetches a role using the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const fetchRole = async (ctx: Context) => {
  const { service } = ecoFlow;

  /**
   * Try to fetch a role by ID and return a success response if successful,
   * or an error response if an error occurs.
   * @param {object} ctx - The context object containing information about the request and response.
   * @returns None
   */
  try {
    const { id } = ctx.params;

    /**
     * Sets the status code to 200 and constructs a response body with success status,
     * and the payload fetched by the RoleService for the given id.
     * @param {number} id - The id of the role to fetch.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await service.RoleService.fetchRole(id),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchRole;
