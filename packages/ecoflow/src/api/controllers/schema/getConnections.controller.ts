import { Context } from "koa";

/**
 * Retrieves the connections from the database and sends them as a response.
 * @param {Context} ctx - The Koa context object representing the HTTP request and response.
 * @returns None
 */
const getConnections = async (ctx: Context) => {
  /**
   * Sets the status to 200 and returns a response body containing the payload
   * of the connection list and the count of connections from the database.
   * @param {object} ecoFlow - The object containing the database connection.
   * @param {object} ctx - The context object for the HTTP request/response.
   * @returns None
   */
  const { database } = ecoFlow;
  ctx.status = 200;
  ctx.body = {
    payload: database.connectionList,
    count: database.counntConnections,
  };
};

export default getConnections;
