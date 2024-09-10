import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Fetches user information using the provided context.
 * @param {Context} ctx - The context object containing user information.
 * @returns None
 */
const fetchUserInfo = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  /**
   * Retrieves user information from the UserService and constructs a response object
   * with the user's details. If successful, returns a response with user information.
   * If an error occurs, returns a response with the error details.
   * @param {Object} service - The service object containing the UserService.
   * @param {Object} ctx - The context object containing user information.
   * @returns None
   */
  try {
    const { UserService } = service;
    const user = (await UserService.getUserInfos(ctx.user)).user!;

    /**
     * Sets the response body with a success status and user data payload.
     * @param {ApiResponse} success - Indicates if the operation was successful.
     * @param {object} payload - The payload containing user information.
     * @param {string} payload.name - The name of the user.
     * @param {string} payload.username - The username of the user.
     * @param {string} payload.email - The email of the user.
     * @param {boolean} payload.isPermanent - Indicates if the user is permanent.
     * @param {Date | string} payload.createdAt - The creation date of the user.
     * @returns None
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: {
        name: user.name,
        username: user.username,
        email: user.email,
        isPermanent: user.isPermanent,
        createdAt:
          typeof user.created_at === "string"
            ? new Date(user.created_at)
            : user.created_at,
      },
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchUserInfo;
