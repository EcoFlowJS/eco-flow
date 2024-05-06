import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Inserts data into a database collection or table using the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 * @throws {Error} If there is an error during the data insertion process.
 */
const insertDatabaseData = async (ctx: Context) => {
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
   * Try block that inserts data into a database and adds an audit log entry.
   * @param {object} ctx - The context object containing the request body and user information.
   * @param {object} connection - The database connection object.
   * @param {string} collectionORtableName - The name of the collection or table where data is inserted.
   * @returns None
   */
  try {
    const { insertData } = ctx.request.body;

    /**
     * Sets the status code to 200 and constructs a response body with success status,
     * payload data obtained by inserting data into the database using SchemaEditorService.
     * @param {number} 200 - The HTTP status code indicating a successful response.
     * @param {<ApiResponse>} - The response body object with success status and payload data.
     * @param {service.SchemaEditorService} - An instance of SchemaEditorService used to insert data.
     * @param {connection} - The connection object to the database.
     * @param {collectionORtableName} - The name of the collection or table to insert data into.
     * @param {insertData} - The data to be inserted into the database.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).insertDatabaseData(collectionORtableName, insertData),
    };

    /**
     * Adds a new log entry to the audit logs service.
     * @param {Object} logData - The data object containing log information.
     * @param {string} logData.message - The message to be logged.
     * @param {string} logData.type - The type of log entry (e.g., "Info", "Error").
     * @param {string} logData.userID - The user ID associated with the log entry.
     * @returns Promise<void>
     */
    await service.AuditLogsService.addLog({
      message: `New record inserted in table or collection named ${collectionORtableName} in database connection ${connectionName}`,
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

export default insertDatabaseData;
