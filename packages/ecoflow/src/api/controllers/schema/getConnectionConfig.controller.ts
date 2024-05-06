import { Context } from "koa";

/**
 * Retrieves the connection configuration based on the context provided.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const getConnectionConfig = async (ctx: Context) => {
  const { _, database } = ecoFlow;
  const { id } = ctx.params;

  ctx.status = 200;

  /**
   * Checks if the id is undefined. If it is, retrieves the database configuration
   * and returns it along with the count of configurations.
   * @param {any} id - The id to check for undefined.
   * @returns None
   */
  if (_.isUndefined(id)) {
    const ConnectionConfig = await database.getDatabaseConfig();
    ctx.body = {
      payload: ConnectionConfig,
      count: ConnectionConfig.length,
    };
    return;
  }

  /**
   * Retrieves the connection configuration for a specific database ID from the database.
   * @param {string} ctx.params.id - The ID of the database for which the configuration is retrieved.
   * @returns {Promise<ConnectionConfig>} A promise that resolves to the connection configuration object.
   */
  const ConnectionConfig = await database.getDatabaseConfig(ctx.params.id);

  /**
   * Sets the response body with an object containing the payload and count of ConnectionConfig.
   * @param {Object} ctx - The context object representing the HTTP request and response.
   * @returns None
   */
  ctx.body = {
    payload: ConnectionConfig,
    count: ConnectionConfig.length,
  };
};

export default getConnectionConfig;
