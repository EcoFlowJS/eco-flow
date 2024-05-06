import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Creates a new collection or table in the database based on the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const createCollectionsORTable = async (ctx: Context) => {
  const { database, service } = ecoFlow;
  const { connectionName } = ctx.params;

  /**
   * Retrieves the database connection based on the provided connection name.
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
   * Try block that attempts to create a new table or collection in the database based on the request body.
   * If successful, it returns a success response with the created table/collection details.
   * If an error occurs, it returns an error response with the error details.
   * @param {Object} ctx - The context object containing the request and response information.
   * @returns None
   */
  try {
    const { name, tableLike } = ctx.request.body;

    /**
     * Sets the status to 200 and constructs a response body with success status, payload
     * obtained by creating collections or tables using SchemaEditorService.
     * @param {string} name - The name of the collection or table to be created.
     * @param {object} tableLike - The schema or structure of the collection or table.
     * @param {object} connection - The database connection object.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).createCollectionsORTable(name, tableLike),
    };

    /**
     * Adds a log entry to the audit logs service.
     * @param {Object} logDetails - The details of the log entry.
     * @param {string} logDetails.message - The message to be logged.
     * @param {string} logDetails.type - The type of the log entry (e.g., "Info", "Error").
     * @param {string} logDetails.userID - The user ID associated with the log entry.
     * @returns None
     */
    await service.AuditLogsService.addLog({
      message: `Table or Collection named ${name} has been created in database connection ${connectionName}`,
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

export default createCollectionsORTable;
