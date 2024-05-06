import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Fetches the installed modules using the ecoModule from the ecoFlow object.
 * @param {Context} ctx - The context object containing information about the HTTP request and response.
 * @returns None
 */
const fetchInstalledModule = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;

  /**
   * Try to set the status and body of the context based on the success or failure of the operation.
   * If successful, set status to 200 and return the installed modules.
   * If an error occurs, set status to 404 and return the error message.
   * @param {Context} ctx - The context object representing the HTTP request and response.
   * @returns None
   */
  try {
    /**
     * Sets the status code to 200 and constructs a response body with success status and payload.
     * @param {number} 200 - The HTTP status code indicating a successful response.
     * @param {ApiResponse} - The structure of the response body containing success status and payload.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await ecoModule.installedModules,
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchInstalledModule;
