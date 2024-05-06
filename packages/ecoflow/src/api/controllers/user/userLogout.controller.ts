import Helper from "@ecoflow/helper";
import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Logs out the user by removing the refresh token and setting the user to null in the context.
 * @param {Context} ctx - The Koa context object
 * @returns None
 */
const userLogout = async (ctx: Context) => {
  /**
   * Retrieves the value of the "RefreshToken" cookie using the Helper class.
   * @param {Context} ctx - The context object containing information about the request.
   * @param {string} cookieName - The name of the cookie to retrieve.
   * @returns {Promise<string>} A promise that resolves to the value of the cookie.
   */
  const token = await Helper.getCookie(ctx, "RefreshToken");
  const { _id } = ctx.token ? ctx.token : { _id: "" };
  const { TokenServices } = ecoFlow.service;
  ctx.status = 200;

  /**
   * Attempts to remove the token associated with the given ID using TokenServices.
   * If successful, sets the response body to indicate successful logout and sets ctx.user to null.
   * If an error occurs, sets the response body to indicate an error with the error payload.
   * @param {string} token - the token to remove
   * @param {string} _id - the ID associated with the token
   * @returns None
   */
  try {
    /**
     * Removes a token from the database using the TokenServices class.
     * @param {string} token - The token to be removed.
     * @param {string} _id - The ID of the token to be removed.
     * @returns Promise<void>
     */
    await TokenServices.removeToken(token!, _id);

    /**
     * Sets the response body to indicate a successful logout and sets the user context to null.
     * @returns None
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: "Logout successful",
    };
    ctx.user = null;
  } catch (err) {
    ctx.body = <ApiResponse>{ error: true, payload: err };
  }
};

export default userLogout;
