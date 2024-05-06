import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Fetches the count of available search packages asynchronously and updates the context accordingly.
 * @param {Context} ctx - The context object containing information about the request and response.
 * @returns None
 */
const fetchSearchPackagesCount = async (ctx: Context) => {
  const { ecoModule } = ecoFlow;
  /**
   * Try to set the status and body of the context based on the success or failure of the operation.
   * If successful, set status to 200 and return the available packages counts.
   * If an error occurs, set status to 404 and return the error message.
   * @param {Context} ctx - The context object representing the state of the request/response.
   * @returns None
   */
  try {
    /**
     * Sets the status code to 200 and constructs a response body with success status and payload.
     * @param {number} 200 - The HTTP status code indicating a successful response.
     * @param {<ApiResponse>} - The response object containing success status and payload.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await ecoModule.availablePackagesCounts,
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchSearchPackagesCount;
