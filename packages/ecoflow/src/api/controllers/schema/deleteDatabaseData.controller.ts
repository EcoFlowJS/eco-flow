import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Deletes data from the database based on the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const deleteDatabaseData = async (ctx: Context) => {
  const { database, service } = ecoFlow;
  const { connectionName, collectionORtableName, dataID } = ctx.params;

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
   * @param {any} connection - The database connection object.
   * @returns None
   */
  if (typeof connection === "undefined") {
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
   * Try to delete data from a database table or collection and log the action in the audit logs.
   * @param {Object} ctx - The context object containing information about the request and response.
   * @param {string} collectionORtableName - The name of the collection or table from which data is to be deleted.
   * @param {string} dataID - The ID of the data to be deleted.
   * @param {string} connection - The database connection name.
   * @param {string} connectionName - The name of the database connection.
   * @returns None
   */
  try {
    /**
     * Sets the status to 200 and constructs a response body with success status, payload,
     * and deletes data from the database using the SchemaEditorService.
     * @param {string} collectionORtableName - The name of the collection or table to delete data from.
     * @param {string} dataID - The ID of the data to be deleted.
     * @param {Connection} connection - The database connection object.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).deleteDatabaseData(collectionORtableName, dataID),
    };

    /**
     * Adds a log entry to the audit logs service.
     * @param {Object} logData - The data object containing log information.
     * @param {string} logData.message - The message to be logged.
     * @param {string} logData.type - The type of log entry (e.g., "Info", "Error").
     * @param {string} logData.userID - The user ID associated with the log entry.
     * @returns None
     */
    await service.AuditLogsService.addLog({
      message: `Record deleted in table or collection named ${collectionORtableName} with id ${dataID} in database connection ${connectionName}`,
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

export default deleteDatabaseData;
