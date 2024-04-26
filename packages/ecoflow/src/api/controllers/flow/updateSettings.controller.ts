import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";
import defaultFlowEditorSettings from "../../../defaults/defaultFlowEditorSettings.default";

const updateSettings = async (ctx: Context) => {
  const { _, service } = ecoFlow;
  const { FlowSettingsService } = service;
  try {
    const { settings } = ctx.request.body;
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
