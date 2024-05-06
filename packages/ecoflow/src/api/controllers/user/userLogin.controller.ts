import Helper from "@ecoflow/helper";
import { ApiResponse, userTableCollection } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Handles user login functionality by verifying the username and password provided in the request body.
 * If the user is found and the password is correct, it generates access and refresh tokens, sets a cookie with the refresh token,
 * and returns a success response with the access token.
 * If the user is not found or the password is incorrect, it returns an error response and logs the event.
 * @param {Context} ctx - The Koa context object representing the HTTP request and response.
 * @returns None
 */
const userLogin = async (ctx: Context) => {
  const { username, password } = ctx.request.body;
  const { server, service } = ecoFlow;
  const { UserService, TokenServices } = service;
  const { isAvailable, user } = await UserService.getUserInfos(username);

  /**
   * Determines the options object based on the server's security settings.
   * If the server is secure, the options object will have secure set to true,
   * otherwise, secure will be set to false.
   * @returns {Object} The options object with secure and httpOnly properties.
   */
  const options = server.isSecure
    ? {
        secure: true,
        httpOnly: true,
      }
    : {
        secure: false,
        httpOnly: true,
      };

  ctx.status = 200;

  /**
   * If the user is not available, set the response body to an error message indicating
   * that no user was found with the given username.
   * @param {boolean} isAvailable - Indicates whether the user is available or not.
   * @param {string} username - The username of the user being searched for.
   * @param {Context} ctx - The context object representing the request and response.
   * @returns None
   */
  if (!isAvailable) {
    ctx.body = <ApiResponse>{
      error: true,
      payload: `No user found with username ${username}`,
    };
    return;
  }

  /**
   * Compares the hashed password with the password stored in the user table collection.
   * If the passwords do not match, it sets the response body to an error message and logs
   * the invalid password attempt in the audit logs.
   * @param {string} password - The password to compare.
   * @param {userTableCollection} user - The user object containing the hashed password.
   * @returns None
   */
  if (
    !(await Helper.compareHash(password, (<userTableCollection>user).password!))
  ) {
    ctx.body = <ApiResponse>{
      error: true,
      payload: `Invalid password for ${username}`,
    };
    await service.AuditLogsService.addLog({
      message: `Invalid password for ${username}`,
      type: "Error",
      userID: "SYSTEM_LOG",
    });
    return;
  }

  /**
   * Generates an access token, a refresh token, and the expiration time for the refresh token
   * for the given username.
   * @param {string} username - The username for which tokens are generated.
   * @returns An array containing the access token, refresh token, and refresh token expiration time.
   */
  const [access_token, refresh_token, refresh_token_expires_at] =
    await TokenServices.generateToken(username.toLowerCase());

  /**
   * Sets a cookie named "RefreshToken" with the provided refresh token value and options.
   * @param {object} ctx - The context object for the request.
   * @param {string} name - The name of the cookie to set ("RefreshToken").
   * @param {string} value - The value of the refresh token to set in the cookie.
   * @param {object} options - Additional options for the cookie.
   * @param {Date} options.expires - The expiration date for the cookie.
   * @returns Promise<void>
   */
  await Helper.setCookie(ctx, "RefreshToken", refresh_token, {
    ...options,
    expires: new Date(refresh_token_expires_at),
  });

  /**
   * Sets the user property of the context object to the lowercase version of the provided username.
   * Sets the body of the context object to an ApiResponse object with success set to true and the provided access token as payload.
   * @param {string} username - The username to be converted to lowercase and assigned to the user property.
   * @param {string} access_token - The access token to be set as the payload of the ApiResponse object.
   * @returns None
   */
  ctx.user = username.toLowerCase();
  ctx.body = <ApiResponse>{
    success: true,
    payload: access_token,
  };
};

export default userLogin;
