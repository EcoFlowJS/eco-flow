import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Installs Eco packages based on the package name and version provided in the request body.
 * @param {Context} ctx - The Koa context object containing the request and response details.
 * @returns None
 * @throws Throws an error if the package name or version is missing.
 */
const installEcoPackages = async (ctx: Context) => {
  const { _, ecoModule, service } = ecoFlow;
  const { packageName, version } = ctx.request.body;

  /**
   * Try to install a new package using the provided package name and version.
   * If successful, add the module to the ecoModule and return a success response.
   * If an error occurs during the installation process, catch the error and return an error response.
   * @param {string} packageName - The name of the package to install.
   * @param {string} version - The version of the package to install.
   * @returns None
   */
  try {
    /**
     * Checks if the package name is undefined or empty, and throws an error if it is.
     * @param {string} packageName - The name of the package to check.
     * @throws {string} Throws an error if the package name is undefined or empty.
     */
    if (_.isUndefined(packageName) || _.isEmpty(packageName))
      throw "Package name is required";

    /**
     * Checks if the version is undefined or empty, and throws an error if it is.
     * @param {any} version - The version to check.
     * @throws {string} Throws an error message if the version is undefined or empty.
     */
    if (_.isUndefined(version) || _.isEmpty(version))
      throw "Package name is required";

    /**
     * Installs a module using the Eco package manager.
     * @param {string} packageName - The name of the package to install.
     * @param {string} version - The version of the package to install.
     * @returns The schema of the installed module.
     */
    const schema = await ecoModule.installModule(packageName, version);

    /**
     * Adds a module to the ecoModule using the provided schema.
     * @param {Schema} schema - The schema of the module to be added.
     * @returns Promise<void>
     */
    await ecoModule.addModule(schema);

    /**
     * Sets the status of the response to 200 and constructs a response body with a success flag
     * and payload data from the provided schema module.
     * @param {number} 200 - The HTTP status code for a successful response.
     * @param {<ApiResponse>} - The response body object with success flag and payload data.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: schema.module,
    };

    /**
     * Adds a new log entry to the audit logs service.
     * @param {Object} logData - The data for the log entry.
     * @param {string} logData.message - The message to be logged.
     * @param {string} logData.type - The type of log entry (e.g. "Info", "Error").
     * @param {string} logData.userID - The ID of the user who triggered the log entry.
     * @returns None
     */
    await service.AuditLogsService.addLog({
      message: `New package(${packageName}) has been installed by ${ctx.user}`,
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

export default installEcoPackages;
