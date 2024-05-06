import { Context } from "koa";
import { ApiResponse } from "@ecoflow/types";

/**
 * Deletes a collection or table from the specified database connection.
 * @param {Context} ctx - The Koa context object containing information about the request.
 * @returns None
 */
const deleteCollectionsORTable = async (ctx: Context) => {
  const { _, database, service } = ecoFlow;
  const { connectionName, collectionOrTableName } = ctx.params;

  /**
   * Retrieves the database connection with the given connection name.
   * @param {string} connectionName - The name of the database connection to retrieve.
   * @returns The database connection object.
   */
  const connection = database.getDatabaseConnection(connectionName);

  /**
   * Checks if the database connection is undefined. If it is, sets the status to 400,
   * and returns an error response with a message indicating that the database connection
   * is not found or invalid.
   * @param {any} connection - The database connection object to check.
   * @returns None
   */
  if (_.isUndefined(connection)) {
    ctx.status = 400;
    ctx.body = <ApiResponse>{
      error: true,
      payload: {
        msg: "Database connection not found or invalid",
      },
    };

    return;
  }

  /**
   * Try to delete a collection or table based on the provided collectionOrTableName.
   * If successful, a success response is sent with a status of 200 and a log is added to the AuditLogsService.
   * If an error occurs, a status of 409 is sent with the error message in the response payload.
   * @param {string} collectionOrTableName - The name of the collection or table to delete.
   * @param {object} ctx - The context object containing information about the request and response.
   * @param {string} connection - The database connection name.
   * @param {string} connectionName - The name of the database connection.
   * @returns None
   */
  try {
    /**
     * Checks if the collectionOrTableName is undefined and throws an error if it is.
     * Sets the status to 200 and constructs a response body with success true and
     * the result of deleting the specified collection or table using the SchemaEditorService.
     * @param {string} collectionOrTableName - The name of the collection or table to delete.
     * @param {Context} ctx - The context object representing the state of the HTTP request.
     * @param {Connection} connection - The database connection object.
     * @returns None
     */
    if (_.isUndefined(collectionOrTableName))
      throw "Collection table not found";

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).deleteCollectionsORTable(collectionOrTableName),
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
      message: `Table or Collection named ${collectionOrTableName} has been deleted in database connection ${connectionName}`,
      type: "Info",
      userID: ctx.user,
    });
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default deleteCollectionsORTable;
