import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Searches for packages using the provided package name in the ecoModule.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const searchPackages = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;
  const { packageName } = ctx.params;

  /**
   * Try to search for a package using the provided package name and return the result in the response.
   * If the package name is not provided or is empty, an error is thrown.
   * @param {string} packageName - The name of the package to search for.
   * @returns None
   */
  try {
    /**
     * Checks if the package name is undefined or empty, and throws an error if it is.
     * @param {string} packageName - The name of the package to check.
     * @throws {string} Throws an error if the package name is not provided.
     */
    if (_.isUndefined(packageName) || _.isEmpty(packageName))
      throw "Package name is not provided.";

    /**
     * Sets the response body to an ApiResponse object with the success flag set to true
     * and the payload set to the result of searching for a package name using the ecoModule.
     * @returns None
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: await ecoModule.searchModule(packageName),
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default searchPackages;
