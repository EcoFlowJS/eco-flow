import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Retrieves data from a database based on the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const getDatabaseData = async (ctx: Context) => {
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
   * Sets the status of the context to 200 and assigns a new ApiResponse object to the body
   * with success set to true and payload containing the database data fetched using the
   * SchemaEditorService.
   * @param {Context} ctx - The context object representing the HTTP request and response.
   * @param {string} collectionORtableName - The name of the collection or table to fetch data from.
   * @param {Connection} connection - The database connection object.
   * @returns None
   */
  ctx.status = 200;
  ctx.body = <ApiResponse>{
    success: true,
    payload: await new service.SchemaEditorService(connection).getDatabaseData(
      collectionORtableName
    ),
  };
};

export default getDatabaseData;
