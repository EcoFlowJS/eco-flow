import { Context } from "koa";
import { Builder } from "@ecoflow/utils";
import { ApiResponse } from "@ecoflow/types";
import loadEnvironments from "../../../helper/env.helper";

/**
 * Commits the environment variables based on the type specified in the context.
 * @param {Context} ctx - The context object containing the request body and other information.
 * @returns None
 */
const commitEnvs = async (ctx: Context) => {
  const { type, finalEnvs } = ctx.request.body;
  const { config, service } = ecoFlow;
  const { envDir } = config._config;

  /**
   * Updates the user or system environments based on the type provided.
   * @param {string} type - The type of environment to update (user or system).
   * @param {string} envDir - The directory where the environment is stored.
   * @param {Array<string>} finalEnvs - The final list of environments to update.
   * @param {Context} ctx - The context object containing information about the request.
   * @returns None
   */
  switch (type) {
    /**
     * Handles the case when the action is related to a user. It sets the user environment,
     * loads the environments, sends a success response with a message and the updated user environments,
     * and adds a log to the Audit Logs Service.
     * @returns None
     */
    case "user":
      /**
       * Sets the user environment variables for the Builder environment.
       * @param {string} envDir - The directory where the environment variables are stored.
       * @param {object} finalEnvs - The final set of environment variables to set.
       * @param {boolean} overwrite - Whether to overwrite existing environment variables.
       * @returns Promise<void>
       */
      await Builder.ENV.setUserEnv(envDir!, finalEnvs, true);

      /**
       * Loads the environments for the application.
       * @returns None
       */
      loadEnvironments();

      /**
       * Sets the status to 200 and constructs a response body with a success message
       * and the new environments committed successfully.
       * @returns None
       */
      ctx.status = 200;
      ctx.body = <ApiResponse>{
        success: true,
        payload: {
          msg: "Environments committed successfully.",
          newEnvs: Builder.ENV.getUserEnv(),
        },
      };

      /**
       * Adds a log entry to the audit logs service.
       * @param {Object} logData - The data for the log entry.
       * @param {string} logData.message - The message to be logged.
       * @param {string} logData.type - The type of log entry (e.g., Info, Error).
       * @param {string} logData.userID - The ID of the user associated with the log entry.
       * @returns Promise<void>
       */
      await service.AuditLogsService.addLog({
        message: "User environments has been updated",
        type: "Info",
        userID: ctx.user,
      });
      break;
    /**
     * Handles the "system" case by setting system environment variables, loading environments,
     * setting the response status to 200, and sending a success response with a message and new system environments.
     * Also adds an audit log for the update of system environments.
     * @returns None
     */
    case "system":
      /**
       * Sets the system environment variables using the provided environment directory and final environment variables.
       * @param {string} envDir - The directory containing the environment variables.
       * @param {Object} finalEnvs - The final environment variables to set.
       * @returns {Promise<void>} A promise that resolves once the system environment variables are set.
       */
      await Builder.ENV.setSystemEnv(envDir!, finalEnvs);

      /**
       * Loads the environments for the application.
       * @returns None
       */
      loadEnvironments();

      /**
       * Sets the status code to 200 and constructs a response body with a success message
       * and the new environments that were committed successfully.
       * @returns None
       */
      ctx.status = 200;
      ctx.body = <ApiResponse>{
        success: true,
        payload: {
          msg: "Environments committed successfully.",
          newEnvs: Builder.ENV.getSystemEnv(),
        },
      };

      /**
       * Adds a log entry to the audit logs service.
       * @param {Object} logData - The data for the log entry.
       * @param {string} logData.message - The message to be logged.
       * @param {string} logData.type - The type of the log entry (e.g., Info, Error).
       * @param {string} logData.userID - The user ID associated with the log entry.
       * @returns Promise<void>
       */
      await service.AuditLogsService.addLog({
        message: "System environments has been updated",
        type: "Info",
        userID: ctx.user,
      });
      break;
  }
};

export default commitEnvs;
