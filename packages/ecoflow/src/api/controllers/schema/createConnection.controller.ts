import { Context } from "koa";
import { ConnectionDefinations } from "@ecoflow/types";
import getConnectionsDetails from "../../helpers/getDatabaseConnectionsDetails";

/**
 * Creates a new database connection based on the provided context.
 * @param {Context} ctx - The context object containing the request details.
 * @returns None
 */
const createConnection = async (ctx: Context) => {
  const { database, service } = ecoFlow;
  /**
   * Try to add a new database connection using the provided details and handle the response accordingly.
   * @throws {Error} If there is an error during the process.
   * @returns None
   */
  try {
    /**
     * Extracts the name, driver, and connection details from the given ConnectionDefinations object.
     * @param {ConnectionDefinations} ctx.request.body - The ConnectionDefinations object containing the details.
     * @returns An array containing the name, driver, and connection details.
     */
    const [name, driver, connection] = getConnectionsDetails(
      <ConnectionDefinations>ctx.request.body
    );

    /**
     * Adds a new database connection to the database using the provided information.
     * @param {string} name - The name of the database connection.
     * @param {string} driver - The driver for the database connection.
     * @param {object} connection - The connection details for the database.
     * @returns An array containing the status of the operation and a message.
     */
    const [status, message] = await database.addDatabaseConnection(
      name,
      driver,
      {
        ...connection,
      }
    );

    /**
     * Sets the status of the context and assigns a response body if status is falsy.
     * @param {number} status - The HTTP status code to set in the context.
     * @param {boolean} status - The status to check for falsy value.
     * @param {string} message - The message to include in the response body.
     * @returns None
     */
    ctx.status = 200;
    if (!status) {
      ctx.body = {
        error: true,
        payload: {
          message: message,
        },
      };
    }

    /**
     * Updates the context body with a success response and adds a new database connection log.
     * @param {boolean} status - The status of the operation.
     * @param {string} message - The message to include in the response payload.
     * @param {Object} ctx - The context object containing the response body.
     * @param {Object} database - The database object containing connection information.
     * @param {Object} service - The service object for handling audit logs.
     * @returns None
     */
    if (status) {
      ctx.body = {
        success: true,
        payload: {
          message: message,
          connectionList: {
            payload: database.connectionList,
            count: database.counntConnections,
          },
        },
      };

      await service.AuditLogsService.addLog({
        message: "New Database Connection has been created",
        type: "Info",
        userID: ctx.user,
      });
    }
  } catch (err) {
    ctx.status = 200;
    ctx.body = {
      error: true,
      payload: {
        message: err,
      },
    };
  }
};

export default createConnection;
