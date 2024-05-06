import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Fetches user details based on the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const fetchUserDetails = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { userID } = ctx.params;

  /**
   * Retrieves user information based on the provided userID and returns a response object.
   * If the userID is undefined, it throws an error asking to enter a username.
   * @param {string} userID - The ID of the user to retrieve information for.
   * @returns None
   */
  try {
    if (_.isUndefined(userID)) throw "Please enter a username";

    const { username, name, email, roles, isActive } =
      (await service.UserService.getUserInfos(userID, true)).user || {};

    /**
     * Sets the response body with the ApiResponse object containing the success status and payload data.
     * @param {ApiResponse} success - The success status of the response.
     * @param {string} username - The username of the user.
     * @param {string} name - The name of the user.
     * @param {string} email - The email of the user.
     * @param {string[]} roles - The roles of the user.
     * @param {boolean} isActive - The active status of the user.
     * @returns None
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: { username, name, email, roles, isActive },
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchUserDetails;
