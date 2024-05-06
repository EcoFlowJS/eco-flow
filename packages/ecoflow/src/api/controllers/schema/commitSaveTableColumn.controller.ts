import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Commits the changes made to a table column to the database.
 * @param {Context} ctx - The Koa context object containing information about the request and response.
 * @returns None
 * @throws {Error} If there is an issue committing the changes to the database.
 */
const commitSaveTableColumn = async (ctx: Context) => {
  const { database, service } = ecoFlow;
  const { connectionName, collectionORtableName } = ctx.params;

  /**
   * Retrieves the database connection with the given connection name.
   * @param {string} connectionName - The name of the database connection to retrieve.
   * @returns The database connection object.
   */
  const connection = database.getDatabaseConnection(connectionName);

  /**
   * Checks if the connection is undefined and sets the status and response body accordingly.
   * If the connection is undefined, it sets the status to 400 and returns an error response.
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
   * Updates a table column in the database and adds an audit log entry.
   * @param {Object} ctx - The context object containing the request body and user information.
   * @param {string} collectionORtableName - The name of the collection or table being updated.
   * @param {Object} connection - The database connection object.
   * @returns None
   * @throws {Error} If there is an error during the update process.
   */
  try {
    const { columnData } = ctx.request.body;

    /**
     * Sets the status code of the response to 200 and constructs a response body with
     * success status, payload from committing the save table column operation.
     * @param {object} ctx - The context object representing the HTTP request and response.
     * @param {string} collectionORtableName - The name of the collection or table.
     * @param {object} columnData - The data of the column to be saved.
     * @param {object} connection - The connection object to the database.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).commitSaveTableColumn(collectionORtableName, columnData),
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
      message: `Table column has been updated in table named ${collectionORtableName} in database connection ${connectionName}`,
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

export default commitSaveTableColumn;
