import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Upgrades or downgrades a package based on the provided package name and version in the request body.
 * @param {Context} ctx - The Koa context object containing the request and response details.
 * @returns None
 * @throws Throws an error if the package name or version is missing in the request body.
 */
const upgradeDowngradePackage = async (ctx: Context) => {
  const { _, ecoModule, service } = ecoFlow;
  const { packageName, version } = ctx.request.body;

  /**
   * Upgrades or downgrades a package module based on the provided package name and version.
   * If successful, updates the module schema, sets the response status to 200, and returns the updated module in the response body.
   * If an error occurs, sets the response status to 409 and returns the error in the response body.
   * Additionally, logs the package version change in the audit logs.
   * @param {string} packageName - The name of the package to upgrade or downgrade.
   * @param {string} version - The version to upgrade or downgrade to.
   * @param {Context} ctx - The context object containing information about the request.
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
     * Upgrades or downgrades the specified package to the given version using the ecoModule.
     * @param {string} packageName - The name of the package to upgrade/downgrade.
     * @param {string} version - The version to upgrade/downgrade to.
     * @returns The schema after upgrading/downgrading the package.
     */
    const schema = await ecoModule.upgradeDowngradeModule(packageName, version);

    /**
     * Update the ecoModule with the provided schema.
     * @param {Schema} schema - The schema object to update the ecoModule with.
     * @returns {Promise<void>} A promise that resolves once the update is complete.
     */
    await ecoModule.updateModule(schema);

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
     * Adds a log entry to the audit logs service.
     * @param {Object} logData - The data object containing log information.
     * @param {string} logData.message - The message to be logged.
     * @param {string} logData.type - The type of log entry (e.g., "Info", "Error").
     * @param {string} logData.userID - The user ID associated with the log entry.
     * @returns None
     */
    await service.AuditLogsService.addLog({
      message: `Package(${packageName}) version has been changed to ${version} by ${ctx.user}`,
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

export default upgradeDowngradePackage;
