import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Retrieves a collection or table from the database based on the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const getCollectionOrTable = async (ctx: Context) => {
  const { database, service } = ecoFlow;

  /**
   * Retrieves the database connection based on the provided connection name.
   * @param {string} connectionName - The name of the database connection to retrieve.
   * @returns The database connection object.
   */
  const connection = database.getDatabaseConnection(ctx.params.connectionName);

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
   * Sets the status code of the response to 200 and constructs a response body with
   * a success flag, payload obtained by calling getCollectionOrTable() method of SchemaEditorService.
   * @param {number} 200 - The HTTP status code for a successful response.
   * @param {<ApiResponse>} - The response object with success flag and payload.
   * @returns None
   */
  ctx.status = 200;
  ctx.body = <ApiResponse>{
    success: true,
    payload: await new service.SchemaEditorService(
      connection
    ).getCollectionOrTable(),
  };
};

export default getCollectionOrTable;
