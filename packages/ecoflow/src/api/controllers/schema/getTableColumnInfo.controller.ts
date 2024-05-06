import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Retrieves information about the columns of a table from the specified database connection.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const getTableColumnInfo = async (ctx: Context) => {
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
   * @param {any} connection - the database connection object
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
   * Try block that attempts to set the status and body of the context based on the result of
   * fetching table column information using the SchemaEditorService.
   * If successful, sets status to 200 and body to a successful ApiResponse object with the fetched data.
   * If an error occurs, sets status to 409 and body to an error ApiResponse object with the error message.
   * @param {Context} ctx - The context object representing the HTTP request and response.
   * @param {Connection} connection - The database connection object.
   * @param {string} collectionORtableName - The name of the collection or table to fetch column information from.
   * @returns None
   */
  try {
    /**
     * Sets the status to 200 and constructs a response body with success status, payload
     * containing table column information fetched using SchemaEditorService.
     * @param {Connection} connection - The database connection object.
     * @param {string} collectionORtableName - The name of the collection or table.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await new service.SchemaEditorService(
        connection
      ).getTableColumnInfo(collectionORtableName),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default getTableColumnInfo;
