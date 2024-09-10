import { ConnectionDefinations } from "@ecoflow/types";
import getConnectionsDetails from "../../helpers/getDatabaseConnectionsDetails.js";
import { Context } from "koa";

/**
 * Updates a database connection based on the information provided in the context object.
 * @param {Context} ctx - The context object containing the request information.
 * @returns None
 */
const updateConnection = async (ctx: Context) => {
  const { database, service } = ecoFlow;

  /**
   * Updates a database connection based on the details provided in the request body.
   * If successful, returns a success message along with the updated connection list.
   * If unsuccessful, returns an error message.
   * @param {Context} ctx - The Koa context object.
   * @returns None
   */
  try {
    /**
     * Extracts the name, driver, and connection details from the ConnectionDefinations object
     * in the request body.
     * @param {ConnectionDefinations} ctx.request.body - The ConnectionDefinations object from the request body.
     * @returns An array containing the extracted name, driver, and connection details.
     */
    const [name, driver, connection] = getConnectionsDetails(
      <ConnectionDefinations>ctx.request.body
    );

    /**
     * Updates the database connection with the provided name, driver, and connection details.
     * @param {string} name - The name of the database connection to update.
     * @param {string} driver - The driver of the database connection.
     * @param {object} connection - The connection details to update.
     * @returns An array containing the status of the update operation and a message.
     */
    const [status, message] = await database.updateDatabaseConnection(
      name,
      driver,
      {
        ...connection,
      }
    );

    /**
     * Sets the status of the response and constructs an error response body if status is falsy.
     * @param {number} status - The status code to set for the response.
     * @param {boolean} status - The condition to check for constructing an error response body.
     * @param {string} message - The error message to include in the response body.
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
     * Updates the database connection status and adds an audit log if the status is true.
     * @param {boolean} status - The status of the database connection.
     * @param {string} message - The message to be included in the response payload.
     * @param {string} name - The name of the database connection.
     * @param {object} database - The database object containing connectionList and countConnections.
     * @param {object} ctx - The context object containing information about the request.
     * @param {object} service - The service object for handling audit logs.
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
        message: `Database connection named ${name} has been updated`,
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

export default updateConnection;
