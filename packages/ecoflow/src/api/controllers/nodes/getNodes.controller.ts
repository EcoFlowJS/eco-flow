import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Retrieves nodes data asynchronously based on the provided context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const getNodes = async (ctx: Context) => {
  const { ecoModule } = ecoFlow;
  const { nodeId } = ctx.params;
  /**
   * Try to get nodes with the given nodeId from the ecoModule and return a success response
   * or an error response.
   * @param {Context} ctx - The context object for the request/response cycle.
   * @param {string} nodeId - The id of the node to retrieve.
   * @returns None
   */
  try {
    /**
     * Sets the response body to an ApiResponse object with the success flag set to true
     * and the payload set to the result of fetching nodes using the ecoModule for the given nodeId.
     * @returns None
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: await ecoModule.getNodes(nodeId),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default getNodes;
