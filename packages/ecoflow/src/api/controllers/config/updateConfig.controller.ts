import { Context } from "koa";
import parseServerConfigHelper from "../../helpers/parseServerConfigHelper.js";

/**
 * Updates the configuration settings based on the request body and user ID in the context.
 * @param {Context} ctx - The context object containing the request and user information.
 * @returns None
 */
const updateConfig = async (ctx: Context) => {
  ctx.status = 200;

  /**
   * Updates the server configuration with the provided data and logs the action.
   * @param {Object} ecoFlow - An object containing the configuration and service information.
   * @param {Object} ctx - The context object containing the request body and user information.
   * @returns None
   * @throws {Error} If an error occurs during the update process, it is caught and returned in the response.
   */
  try {
    const { config, service } = ecoFlow;

    /**
     * Parses the server configuration based on the request body and user ID.
     * @param {Object} ctx - The context object containing the request body and user information.
     * @returns {Promise<Object>} A promise that resolves to the parsed server configuration.
     */
    const configs = await parseServerConfigHelper({
      ...(<any>ctx.request.body),
      userID: ctx.user,
    });

    /**
     * Updates the configuration settings with the new configurations provided.
     * @param {Object} configs - The new configuration settings to be set.
     * @returns {Object} An object containing the success status and updated configurations.
     */
    const newConfigs = await config.setConfig(configs);
    ctx.body = {
      success: true,
      payload: {
        msg: "Configuration updated successfully.",
        newConfigs: newConfigs,
      },
    };

    /**
     * Adds a new log entry to the audit logs service.
     * @param {Object} logData - The data for the log entry.
     * @param {string} logData.message - The message for the log entry.
     * @param {string} logData.type - The type of the log entry (e.g., Info, Error).
     * @param {string} logData.userID - The user ID associated with the log entry.
     * @returns None
     */
    await service.AuditLogsService.addLog({
      message: "New server configuration has been updated",
      type: "Info",
      userID: ctx.user,
    });
  } catch (error) {
    ctx.body = {
      error: true,
      payload: error,
    };
  }
};

export default updateConfig;
