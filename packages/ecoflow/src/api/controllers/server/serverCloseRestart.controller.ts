import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Handles the server close and restart functionality based on the mode provided in the request body.
 * @param {Context} ctx - The Koa context object representing the HTTP request and response.
 * @returns None
 */
const serverCloseRestart = async (ctx: Context) => {
  const { Mode } = <any>ctx.request.body;
  const { server, service } = ecoFlow;

  ctx.status = 200;

  /**
   * Perform actions based on the mode provided.
   * @param {string} Mode - The mode of operation (restart, stop, status).
   * @returns None
   */
  switch (Mode) {
    /**
     * Handles the "restart" case by adding audit logs, restarting the server after a delay,
     * and sending a response to the client.
     * @returns None
     */
    case "restart":
      /**
       * Sets a timer that will add a log message indicating that the server is restarted
       * and then restarts the server after 30 seconds.
       * @returns None
       */
      setTimeout(async () => {
        await service.AuditLogsService.addLog({
          message: `Server is restarted`,
          type: "Info",
          userID: ctx.user,
        });
        server.restartServer();
      }, 5 * 1000);

      /**
       * Sets the response body to an ApiResponse object with a success status and a message indicating
       * that the server will be restarted in 5 seconds.
       * @type {ApiResponse}
       */
      ctx.body = <ApiResponse>{
        success: true,
        payload: "Server will be restart in 5 seconds",
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
        message: `Server is restart process started`,
        type: "Info",
        userID: ctx.user,
      });
      break;

    /**
     * Handles the "stop" case by adding a log message, closing the server after a delay,
     * and updating the response payload.
     * @returns None
     */
    case "stop":
      /**
       * Sets a timer that will add a log message to the Audit Logs Service indicating that the server is stopped,
       * then closes the server after 30 seconds.
       * @returns None
       */
      setTimeout(async () => {
        await service.AuditLogsService.addLog({
          message: `Server is stopped`,
          type: "Info",
          userID: ctx.user,
        });
        server.closeServer(true);
      }, 5 * 1000);

      /**
       * Sets the response body to an ApiResponse object with a success status and a message payload.
       * @type {ApiResponse}
       * @property {boolean} success - Indicates the success status of the response.
       * @property {string} payload - The message payload indicating server will be stopped in 30 seconds.
       */
      ctx.body = <ApiResponse>{
        success: true,
        payload: "Server will be stopped in 30 seconds",
      };

      /**
       * Adds a log entry to the audit logs service with the given message, type, and user ID.
       * @param {Object} logData - The data object containing the log information.
       * @param {string} logData.message - The message to be logged.
       * @param {string} logData.type - The type of log entry (e.g., "Info", "Error").
       * @param {string} logData.userID - The user ID associated with the log entry.
       * @returns None
       */
      await service.AuditLogsService.addLog({
        message: `Server is stop process started`,
        type: "Info",
        userID: ctx.user,
      });
      break;

    /**
     * Handles the "status" case by setting the response body to an ApiResponse object
     * with success set to true and payload containing the server's online status.
     * @returns None
     */
    case "status":
      /**
       * Sets the response body of the API with a success status and payload containing
       * information about the server state.
       * @type {ApiResponse}
       * @property {boolean} success - Indicates if the API call was successful.
       * @property {object} payload - Contains the server's online status.
       * @property {boolean} isServerOnline - Indicates if the server is online.
       */
      ctx.body = <ApiResponse>{
        success: true,
        payload: { isServerOnline: server.serverState === "Online" },
      };
      break;
  }
};

export default serverCloseRestart;
