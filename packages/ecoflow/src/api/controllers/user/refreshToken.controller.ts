import Helper from "@ecoflow/helper";
import { Context } from "koa";

/**
 * Refreshes the authentication token for the user.
 * @param {Context} ctx - The Koa context object.
 * @returns None
 */
const refreshToken = async (ctx: Context) => {
  const { isAuth, _ } = ecoFlow;
  if (!isAuth) {
    ctx.status = 200;
    ctx.body = {
      success: true,
      payload: process.env.ECOFLOW_SYS_NOAUTH_ACCESS_TOKEN,
    };
    return;
  }

  /**
   * Destructures the TokenServices and AuditLogsService from the ecoFlow.service object.
   * @returns None
   */
  const { TokenServices, AuditLogsService } = ecoFlow.service;

  /**
   * Determines the options object based on the server's security settings.
   * If the server is secure, the options object will have secure set to true,
   * otherwise, it will have secure set to false.
   * @returns {Object} The options object with secure and httpOnly properties.
   */
  const options = ecoFlow.server.isSecure
    ? {
        secure: true,
        httpOnly: true,
      }
    : {
        secure: false,
        httpOnly: true,
      };

  /**
   * Retrieves the refresh token from the cookies using the Helper class.
   * If the token is undefined, sets the status to 403, returns an error response,
   * logs the error message, and returns.
   * @param {Object} ctx - The context object containing information about the request.
   * @returns None
   */
  const token = await Helper.getCookie(ctx, "RefreshToken");
  if (_.isUndefined(token)) {
    ctx.status = 403;
    ctx.body = {
      error: true,
      payload: "Not authorized User.",
    };
    await AuditLogsService.addLog({
      message: `Not authorized User.`,
      type: "Error",
      userID: "SYSTEM_LOG",
    });
    return;
  }

  /**
   * Verifies the JWT token and performs necessary actions based on the verification result.
   * If the user is null, sets the status to 403, returns an error response with a message,
   * adds a warning log to the audit logs, and exits the function.
   * @param {string} token - The JWT token to verify.
   * @returns None
   */
  const user = Helper.verifyJwtToken(token);
  if (user === null) {
    ctx.status = 403;
    ctx.body = {
      error: true,
      payload: "Invalid Refresh Token.",
    };
    await AuditLogsService.addLog({
      message: `Invalid Refresh Token.`,
      type: "Warning",
      userID: "SYSTEM_LOG",
    });
    return;
  }

  /**
   * Verifies the token against the user ID and sets the context status and body accordingly.
   * @param {string} token - The token to be checked.
   * @param {string} _id - The user ID to check against the token.
   * @returns None
   */
  const { _id } = <{ _id: string }>user;
  if (!(await TokenServices.checkToken(token, _id))) {
    ctx.status = 403;
    ctx.body = {
      error: true,
      payload: "Refresh Token Tampered.",
    };
    await AuditLogsService.addLog({
      message: `Refresh Token Tampered`,
      type: "Warning",
      userID: "SYSTEM_LOG",
    });
    return;
  }

  /**
   * Generates an access token, a refresh token, and the expiration time for the refresh token
   * for a given user ID.
   * @param {string} _id - The user ID for which the tokens are generated.
   * @returns An array containing the access token, refresh token, and refresh token expiration time.
   */
  const [access_token, refresh_token, refresh_token_expires_at] =
    await TokenServices.generateToken(_id);

  /**
   * Sets a cookie named "RefreshToken" with the provided refresh token value and options.
   * @param {object} ctx - The context object for the request.
   * @param {string} name - The name of the cookie to set ("RefreshToken").
   * @param {string} value - The value of the refresh token to set in the cookie.
   * @param {object} options - Additional options for setting the cookie.
   * @param {Date} options.expires - The expiration date for the cookie (parsed from refresh_token_expires_at).
   * @returns None
   */
  await Helper.setCookie(ctx, "RefreshToken", refresh_token, {
    ...options,
    expires: new Date(refresh_token_expires_at),
  });

  /**
   * Set the status code to 200 and send a success response with the access token payload.
   * @param {number} 200 - The HTTP status code for success.
   * @param {object} body - The response body containing success status and access token payload.
   * @returns None
   */
  ctx.status = 200;
  ctx.body = {
    success: true,
    payload: access_token,
  };
};

export default refreshToken;
