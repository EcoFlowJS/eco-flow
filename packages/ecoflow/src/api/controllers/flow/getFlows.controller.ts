import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Retrieves the flows description for a given flow name from the flow editor.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const getFlows = async (ctx: Context) => {
  const { flowName } = ctx.params;
  const { flowEditor } = ecoFlow;

  /**
   * Try to get the flow description for the given flow name and return a success response
   * if successful, otherwise return an error response.
   * @param {string} flowName - The name of the flow to get the description for.
   * @returns None
   */
  try {
    /**
     * Sets the response body with a success flag and payload containing the description of the specified flow.
     * @param {ApiResponse} success - A flag indicating the success of the operation.
     * @param {Object} payload - The description of the flow obtained from the flow editor.
     * @returns None
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: await flowEditor.flowsDescription(flowName),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default getFlows;
