import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";
import defaultFlowEditorSettings from "../../../defaults/defaultFlowEditorSettings.default.js";

/**
 * Updates the settings for a given user's flow based on the provided context.
 * @param {Context} ctx - The context object containing the request information.
 * @returns None
 */
const updateSettings = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { FlowSettingsService } = service;

  /**
   * Updates the flow settings based on the settings provided in the request body.
   * Returns the updated flow settings along with default flow editor settings.
   * @param {Object} ctx - The context object containing the request body.
   * @returns None
   * @throws {Error} If there is an error during the update process.
   */
  try {
    const { settings } = ctx.request.body;

    /**
     * Updates the flow settings for a user and maps the updated settings to a new object
     * with boolean values based on the numeric values.
     * @param {User} ctx.user - The user object for which the flow settings are updated.
     * @param {Settings} settings - The new settings to update.
     * @returns {Object} A new object with updated flow settings mapped to boolean values.
     */
    const result = _.mapValues(
      { ...(await FlowSettingsService.updateFlowSettings(ctx.user, settings)) },
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
     * @type {ApiResponse}
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

export default updateSettings;
