import { ApiResponse, FlowEditorSettingsConfigurations } from "@ecoflow/types";
import { Context } from "koa";
import defaultFlowEditorSettings from "../../../defaults/defaultFlowEditorSettings.default";

/**
 * Retrieves the settings for a given context asynchronously.
 * @param {Context} ctx - The context object containing user information.
 * @returns None
 */
const getSettings = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { FlowSettingsService } = service;

  /**
   * Try to fetch flow settings for the user and return a response with the settings.
   * If successful, returns a response with the default flow editor settings merged with the fetched settings.
   * If an error occurs, returns a response with the error message.
   * @returns None
   */
  try {
    /**
     * Maps over the flow settings object fetched for the user and converts numeric values to boolean.
     * @param {Object} ctx - The context object containing user information.
     * @returns {Object} A new object with the flow settings mapped and converted to boolean values.
     */
    const result = _.mapValues(
      { ...(await FlowSettingsService.fetchFlowSettings(ctx.user)) },
      (flowSettings) => {
        return _.isNumber(flowSettings)
          ? flowSettings === 0
            ? false
            : true
          : flowSettings;
      }
    );

    /**
     * Sets the response body with a success flag and payload containing merged default flow editor settings and the result.
     * @param {ApiResponse} success - A boolean indicating the success of the response.
     * @param {Object} payload - The payload object containing default flow editor settings and the result.
     * @returns None
     */
    ctx.body = <ApiResponse>{
      success: true,
      payload: {
        ...defaultFlowEditorSettings,
        ...result,
      },
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default getSettings;
