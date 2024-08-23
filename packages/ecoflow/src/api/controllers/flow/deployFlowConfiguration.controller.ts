import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Deploys the flow configuration provided in the request body.
 * @param {Context} ctx - The Koa context object.
 * @returns None
 * @throws {string} If no flow configurations are provided, if all nodes are not configured,
 * or if there is an error deploying the flow configuration.
 */
const deployFlowConfiguration = async (ctx: Context) => {
  const { _, flowEditor } = ecoFlow;
  /**
   * Try to deploy the flow configurations provided in the request body.
   * If successful, set the response body to indicate success.
   * If any errors occur during the deployment process, set the response body to indicate the error.
   * @throws {string} If no flow configurations are provided, if not all nodes are configured,
   * or if there is an error deploying the flow configuration.
   */
  try {
    const { flowconfigurations, current } = ctx.request.body;
    /**
     * Checks if the flow configurations object is undefined or empty. If it is, throws an error.
     * @param {any} flowconfigurations - The flow configurations object to check.
     * @throws {string} Throws an error message if flow configurations are not provided.
     */
    if (_.isUndefined(flowconfigurations) || _.isEmpty(flowconfigurations))
      throw "No flow configurations provided";

    /**
     * Checks if all nodes are configured in the flow configurations object.
     * If not, throws an error message prompting to configure before deploying.
     * @param {FlowConfigurations} flowconfigurations - The flow configurations object to check.
     * @throws {string} Error message indicating that all nodes need to be configured before deploying.
     */
    if (!flowEditor.isAllNodesConfigured(flowconfigurations))
      throw "All nodes not configured. Please configure it before deploying.";

    /**
     * Deploys the flow configurations using the flow editor.
     * @param {FlowConfiguration[]} flowconfigurations - An array of flow configurations to deploy.
     * @throws {string} Throws an error message if there is an issue deploying the flow configurations.
     */
    if (!(await flowEditor.deploy(flowconfigurations, current)))
      throw "Error deploying flow configuration";

    /**
     * Sets the response body to an ApiResponse object with a success status and a message.
     * @param {ApiResponse} success - A boolean indicating the success status of the response.
     * @param {string} payload - The message or payload to be included in the response.
     * @returns None
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: "Deployed flow configuration",
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default deployFlowConfiguration;
