import { Builder } from "@ecoflow/utils";
import { Context } from "koa";

/**
 * Retrieves the user environment based on the context parameters.
 * @param {Context} ctx - The context object containing the parameters.
 * @returns None
 */
const getUserEnv = (ctx: Context) => {
  const { envID } = ctx.params;

  /**
   * Sets the status of the context to 200 and assigns the user environment based on the provided environment ID to the body of the context.
   * @param {number} envID - The ID of the environment to retrieve user environment data.
   * @returns None
   */
  ctx.status = 200;
  ctx.body = Builder.ENV.getUserEnv(envID);
};

export default getUserEnv;
