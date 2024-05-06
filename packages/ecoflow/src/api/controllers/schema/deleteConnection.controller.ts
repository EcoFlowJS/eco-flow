import { Context } from "koa";

/**
 * Deletes a database connection based on the ConnectionName provided in the context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const deleteConnection = async (ctx: Context) => {
  const { _, database, service } = ecoFlow;
  const { ConnectionName } = ctx.params;

  /**
   * Retrieves the connection to the specified database.
   * @param {string} ConnectionName - The name of the database connection to retrieve.
   * @returns The connection to the specified database.
   */
  const db = database.getDatabaseConnection(ConnectionName);

  /**
   * Checks if the database connection is undefined. If it is, sets the response body
   * to an error message and returns.
   * @param {any} db - the database connection object
   * @returns None
   */
  if (_.isUndefined(db)) {
    ctx.body = {
      error: true,
      payload: {
        message: "Connection Name Not Found",
      },
    };
    return;
  }

  /**
   * Removes a database connection with the given connection name from the database.
   * @param {string} ConnectionName - The name of the connection to be removed.
   * @returns An array containing the status of the removal operation and a message describing the result.
   */
  const [status, message] = await database.removeDatabaseConnection(
    ConnectionName
  );

  /**
   * Sets the response body based on the status and message provided.
   * If status is falsy, it sets an error response with the provided message.
   * If status is truthy, it sets a success response with the provided message and connection list.
   * @param {boolean} status - The status of the response (true for success, false for error).
   * @param {string} message - The message to include in the response.
   * @param {object} database - The database object containing connection list and count.
   * @param {object} ctx - The context object for the response.
   * @returns None
   */
  if (!status) {
    ctx.body = {
      error: true,
      payload: {
        message: message,
      },
    };
    return;
  }

  ctx.body = {
    success: true,
    payload: {
      message: message,
      connectionList: {
        payload: database.connectionList,
        count: database.counntConnections,
      },
    },
  };

  /**
   * Adds a log entry to the audit logs service.
   * @param {Object} logDetails - The details of the log entry.
   * @param {string} logDetails.message - The message to be logged.
   * @param {string} logDetails.type - The type of log entry (e.g., "Info", "Error").
   * @param {string} logDetails.userID - The user ID associated with the log entry.
   * @returns None
   */
  await service.AuditLogsService.addLog({
    message: `Database connection named ${ConnectionName} has been deleted`,
    type: "Info",
    userID: ctx.user,
  });
};

export default deleteConnection;
