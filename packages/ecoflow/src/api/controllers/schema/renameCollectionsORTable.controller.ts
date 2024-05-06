import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Renames a collection or table in the database based on the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const renameCollectionsORTable = async (ctx: Context) => {
  const { database, service } = ecoFlow;
  const { connectionName } = ctx.params;

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
   * Renames a table or collection in the database and adds an audit log entry.
   * @param {Object} ctx - The context object containing the request body and user information.
   * @param {string} ctx.request.body.collectionTableOldName - The old name of the table or collection.
   * @param {string} ctx.request.body.collectionTableNewName - The new name of the table or collection.
   * @param {string} connection - The database connection to perform the rename operation.
   * @param {string} connectionName - The name of the database connection.
   * @returns None
   * @throws {Error} If an error occurs during the renaming process.
   */
  try {
    /**
     * Destructures the collectionTableOldName and collectionTableNewName properties from the request body object.
     * @param {object} ctx - The context object containing the request body.
     * @returns None
     */
    const { collectionTableOldName, collectionTableNewName } = ctx.request.body;

    /**
     * Sets the status to 200 and constructs a response body with success status and payload
     * after renaming collections or tables using SchemaEditorService.
     * @param {string} collectionTableOldName - The old name of the collection or table.
     * @param {string} collectionTableNewName - The new name of the collection or table.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).renameCollectionsORTable(
        collectionTableOldName,
        collectionTableNewName
      ),
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
      message: `Table or Collection renamed from ${collectionTableOldName} to ${collectionTableNewName} has been created in database connection ${connectionName}`,
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

export default renameCollectionsORTable;
