import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Updates the database data based on the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const updateDatabaseData = async (ctx: Context) => {
  const { database, service } = ecoFlow;
  const { connectionName, collectionORtableName } = ctx.params;

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
   * Updates database data based on the provided old and new data, and adds an audit log entry.
   * @param {Object} ctx - The context object containing the request body and user information.
   * @param {string} collectionORtableName - The name of the collection or table being updated.
   * @param {Object} oldData - The old data before the update.
   * @param {Object} newData - The new data after the update.
   * @param {string} connection - The database connection name.
   * @param {string} connectionName - The name of the database connection.
   * @returns None
   * @throws {Error} If there is an error during the update process.
   */
  try {
    const { oldData, newData } = ctx.request.body;

    /**
     * Sets the status to 200 and constructs a response body with success status and payload.
     * @param {number} 200 - The HTTP status code indicating success.
     * @param {ApiResponse} - The response object containing success status and payload.
     * @param {service.SchemaEditorService} - An instance of SchemaEditorService to update database data.
     * @param {connection} - The connection object to the database.
     * @param {string} collectionORtableName - The name of the collection or table to update.
     * @param {any} oldData - The old data to be updated.
     * @param {any} newData - The new data to replace the old data.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).updateDatabaseData(collectionORtableName, oldData, newData),
    };

    /**
     * Adds a log entry to the audit logs service.
     * @param {Object} logData - The data object containing the log information.
     * @param {string} logData.message - The message to be logged.
     * @param {string} logData.type - The type of log entry (e.g., "Info", "Error").
     * @param {string} logData.userID - The user ID associated with the log entry.
     * @returns None
     */
    await service.AuditLogsService.addLog({
      message: `Record updated in table or collection named ${collectionORtableName} with id ${oldData._id} in database connection ${connectionName}`,
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

export default updateDatabaseData;
