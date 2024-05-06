import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Asynchronously removes a package from the ecoModule based on the provided package name.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const removeEcoPackage = async (ctx: Context) => {
  const { _, ecoModule, service } = ecoFlow;
  const { packageName } = ctx.params;

  /**
   * Tries to remove a package with the given package name and handles the response accordingly.
   * If the package name is undefined, it throws an error. If the removal is successful, it sets the status to 200
   * and returns a success response. It also logs the uninstallation of the package in the audit logs.
   * If an error occurs during the process, it sets the status to 409 and returns an error response.
   * @param {string} packageName - The name of the package to be removed.
   * @returns None
   */
  try {
    /**
     * Throws an error if the package name is undefined.
     * @param {any} packageName - The name of the package to check.
     * @throws {string} Throws an error if the package name is undefined.
     */
    if (_.isUndefined(packageName)) throw "package name is required.";

    /**
     * Removes a module with the given package name using the ecoModule.
     * @param {string} packageName - The name of the package/module to be removed.
     * @returns Promise<void>
     */
    await ecoModule.removeModule(packageName);

    /**
     * Sets the status code to 200 and constructs a response body with a success flag and a message.
     * @param {number} 200 - The HTTP status code indicating a successful response.
     * @param {<ApiResponse>} - An object representing the API response.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: "Package removed successfully",
    };

    /**
     * Adds a log entry to the audit logs service indicating that a package has been uninstalled.
     * @param {Object} logDetails - The details of the log entry.
     * @param {string} logDetails.message - The message to be logged.
     * @param {string} logDetails.type - The type of log entry (e.g., "Info", "Error").
     * @param {string} logDetails.userID - The ID of the user who uninstalled the package.
     * @returns None
     */
    await service.AuditLogsService.addLog({
      message: `Package(${packageName}) has been uninstalled by ${ctx.user}`,
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

export default removeEcoPackage;
