import Helper from "@ecoflow/helper";
import { Builder } from "@ecoflow/utils";
import { Context } from "koa";
import jwt from "jsonwebtoken";
import envLoadHelper from "../../../helper/env.helper";

/**
 * Initializes the status of the application based on the context provided.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const initStatus = async (ctx: Context) => {
  /**
   * Checks if the user authentication mode is enable or not.
   * @returns {boolean} true if the user is authentication is enable, false otherwise.
   */
  const isAuth = ecoFlow.isAuth;

  /**
   * Checks if there is no user currently in the database.
   * @returns {Promise<boolean>} A promise that resolves to true if there is no user logged in, false otherwise.
   */
  const isNoUser = await ecoFlow.service.UserService.isNoUser();

  let getAccessToken: string | undefined = undefined;
  let user: string | undefined = undefined;

  /**
   * Checks if the user authentication is enable. If not, generates an access token for the admin user
   * and sets the system environment variables accordingly.
   * @param {boolean} isAuth - Flag indicating if the user is authenticated.
   * @returns None
   */
  if (!isAuth) {
    getAccessToken = process.env.ECOFLOW_SYS_NOAUTH_ACCESS_TOKEN!;
    const Token: any = Helper.verifyJwtToken(getAccessToken);
    if (Token === null) {
      getAccessToken = jwt.sign(
        { _id: "admin", accessRoot: true },
        process.env.ECOFLOW_SYS_TOKEN_SALT!,
        { expiresIn: "9999Y" }
      );
      Builder.ENV.setSystemEnv(ecoFlow.config._config.envDir!, [
        {
          name: "NOAUTH_ACCESS_TOKEN",
          value: getAccessToken,
        },
      ]);

      user = "Administrator";
      envLoadHelper();
    } else {
      user = Token._id === "admin" ? "Administrator" : Token._id;
    }
  }

  /**
   * Sets the response body with the provided data.
   * @param {boolean} isAuth - Indicates if the user authentication mode.
   * @param {boolean} isNoUser - Indicates if no user exists in the database.
   * @param {function} getAccessToken - Function to retrieve the access token.
   * @param {string} user - The user ID.
   * @returns None
   */
  ctx.body = {
    isAuth: isAuth,
    isNewClient: isNoUser,
    getAccessToken: getAccessToken,
    userID: user,
  };
};

export default initStatus;
