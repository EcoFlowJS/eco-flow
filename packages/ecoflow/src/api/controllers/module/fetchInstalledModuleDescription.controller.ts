import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Fetches the description of an installed module based on the provided module name.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const fetchInstalledModuleDescription = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;
  const { name } = ctx.params;
  /**
   * Try to get the installed packages description for a given module name.
   * If successful, set the response status to 200 and return the package description.
   * If an error occurs, set the response status to 404 and return the error message.
   * @param {string} name - The name of the module to get the installed packages description for.
   * @param {Context} ctx - The context object representing the HTTP request and response.
   * @returns None
   */
  try {
    /**
     * Checks if the name is undefined or empty using lodash library.
     * If the name is undefined or empty, throws an error with the message "Module name is undefined".
     * @param {any} name - The name to check for undefined or empty value.
     * @throws {string} Throws an error if the name is undefined or empty.
     */
    if (_.isUndefined(name) || _.isEmpty(name))
      throw "Module name is undefined";

    /**
     * Sets the status code to 200 and constructs a response body with success status,
     * and payload containing the description of installed packages for the given name.
     * @param {string} name - The name of the package to get the description for.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await ecoModule.getInstalledPackagesDescription(name),
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchInstalledModuleDescription;
