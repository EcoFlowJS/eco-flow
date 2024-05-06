import { Context } from "koa";

/**
 * Retrieves configurations based on the context provided.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const getConfigs = async (ctx: Context) => {
  const { _, config } = ecoFlow;
  const { configID } = ctx.params;

  /**
   * Checks if the configID is undefined. If it is undefined, sets the status to 200,
   * and returns a success response with serverConfig and defaultConfig payloads.
   * @param {any} configID - The configuration ID to check for undefined.
   * @returns None
   */
  if (_.isUndefined(configID)) {
    ctx.status = 200;
    ctx.body = {
      success: true,
      payload: {
        serverConfig: await JSON.parse(
          await JSON.stringify(config._config).replace(/\\\\/g, "/")
        ),
        defaultConfig: await config.getDefaultConfigs(),
      },
    };
    return;
  }

  /**
   * Creates a new object with the specified configuration ID and retrieves the configuration
   * data using the provided config object.
   * @param {string} configID - The ID of the configuration to retrieve.
   * @param {Object} config - The configuration object containing the get method.
   * @returns None
   */
  const conf = Object.create({});
  conf[configID] = await config.get(configID);

  /**
   * Sets the status of the context to 200 and sends a response body with success status,
   * payload containing the parsed and stringified 'conf' object with double backslashes replaced by forward slashes.
   * @param {Object} ctx - The context object representing the HTTP request and response.
   * @param {Object} conf - The object to be parsed, stringified, and modified.
   * @returns None
   */
  ctx.status = 200;
  ctx.body = {
    success: true,
    payload: await JSON.parse(await JSON.stringify(conf).replace(/\\\\/g, "/")),
  };
};

export default getConfigs;
