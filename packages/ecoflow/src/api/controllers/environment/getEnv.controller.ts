import { Builder } from "@ecoflow/utils";
import { Context } from "koa";

/**
 * Retrieves environment information based on the context provided.
 * @param {Context} ctx - The context object containing parameters and response properties.
 * @returns None
 */
const getEnv = (ctx: Context) => {
  const { envID } = ctx.params;
  /**
   * Sets the status of the context to 200 and assigns an object to the body property of the context.
   * The object contains systemEnvs and userEnvs retrieved using the Builder.ENV.getSystemEnv and Builder.ENV.getUserEnv methods respectively.
   * @param {number} 200 - The HTTP status code indicating a successful response.
   * @param {object} body - An object containing systemEnvs and userEnvs properties.
   * @returns None
   */
  ctx.status = 200;
  ctx.body = {
    systemEnvs: Builder.ENV.getSystemEnv(envID),
    userEnvs: Builder.ENV.getUserEnv(envID),
  };
};

export default getEnv;
