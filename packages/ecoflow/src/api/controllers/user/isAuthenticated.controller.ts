import Helper from "@ecoflow/helper";
import { Context, Next } from "koa";
import passport from "koa-passport";

/**
 * Middleware function to check if the user is authenticated.
 * @param {Context} ctx - The Koa context object.
 * @param {Next} next - The next middleware function in the stack.
 * @returns None
 */
const isAuthenticated = async (ctx: Context, next: Next) => {
  const { _, isAuth, service } = ecoFlow;
  /**
   * Authenticates the user using the "_ecoFlowPassport" strategy and handles different scenarios based on the result.
   * @param {Object} ctx - The context object representing the state of the server.
   * @param {Function} next - The callback function to invoke the next middleware.
   * @returns None
   */
  return passport.authenticate("_ecoFlowPassport", async (err, result) => {
    if (err) {
      ctx.status = 401;
      ctx.body = {
        error: true,
        payload: err.toString(),
      };
    }

    if (typeof result === "boolean" && !result) {
      ctx.status = 401;
      ctx.body = {
        error: true,
        payload: "Token Expired",
      };
    }

    /**
     * Handles the result object based on its type and authentication status.
     * If the result is a non-empty object and the user is not authenticated,
     * sets the context status to 200, assigns the result to the token, body, and user properties of the context.
     * If the user is authenticated, checks if the user is active and removes the token if not active.
     * Sets the context status and body accordingly.
     * @param {object} result - The result object to handle
     * @param {boolean} isAuth - Flag indicating if the user is authenticated
     * @param {object} ctx - The context object containing request and response information
     * @param {object} service - An object containing UserService and TokenServices
     */
    if (typeof result === "object" && !_.isEmpty(result)) {
      if (!isAuth) {
        ctx.status = 200;
        ctx.token = result;
        ctx.body = {
          success: true,
          payload: result,
        };
        ctx.user = result._id;
      } else {
        const { UserService, TokenServices } = service;
        /**
         * Checks if the user is an active user and handles the response accordingly.
         * If the user is not active, it removes the refresh token, sets status to 400,
         * and returns an error message. If the user is active, it sets status to 200,
         * assigns the token to the context, and returns a success message with the user's details.
         * @param {Object} result - The user object to check for activity.
         * @param {Object} ctx - The context object containing request and response details.
         * @returns None
         */
        if (!(await UserService.isActiveUser(result._id))) {
          await TokenServices.removeToken(
            (await Helper.getCookie(ctx, "RefreshToken"))!,
            result._id
          );
          ctx.status = 400;
          ctx.body = {
            error: true,
            payload: "Not a Valid user.",
          };
        } else {
          ctx.status = 200;
          ctx.token = result;
          ctx.body = {
            success: true,
            payload: result,
          };
          ctx.user = result._id;
        }
      }
      await next();
    }
  })(ctx, next);
};

export default isAuthenticated;
