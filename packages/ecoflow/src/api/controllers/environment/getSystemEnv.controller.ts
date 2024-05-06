import { Builder } from "@ecoflow/utils";
import { Context } from "koa";

/**
 * Retrieves the system environment based on the provided context.
 * @param {Context} ctx - The context object containing parameters.
 * @returns None
 */
const getSystemEnv = (ctx: Context) => {
  const { envID } = ctx.params;

  /**
   * Sets the status of the response to 200 and assigns the body of the response
   * to the value retrieved from the system environment based on the provided envID.
   * @param {number} envID - The ID of the environment to retrieve the value from.
   * @returns None
   */
  ctx.status = 200;
  ctx.body = Builder.ENV.getSystemEnv(envID);
};

export default getSystemEnv;
