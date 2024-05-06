import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Fetches usernames from the UserService based on the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const fetchUserUsernames = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { isSystem } = ctx.params;
  /**
   * Try to get usernames from the UserService based on the system flag.
   * If successful, set the response body with success flag and the retrieved usernames.
   * If an error occurs, set the response status to 409 and the body with error flag and the error message.
   * @param {boolean} isSystem - Flag to determine if the usernames are for the system.
   * @returns None
   */
  try {
    ctx.body = <ApiResponse>{
      success: true,
      payload: await service.UserService.getUsernames(isSystem),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchUserUsernames;
