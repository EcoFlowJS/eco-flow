import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Fetches a module based on the provided module ID from the ecoFlow object in the context.
 * @param {Context} ctx - The context object containing information about the request.
 * @returns None
 */
const fetchModule = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;
  const { moduleID } = ctx.params;

  /**
   * Sets the status of the context to 200 and constructs a response body with ApiResponse structure.
   * @param {number} 200 - The HTTP status code indicating success.
   * @param {<ApiResponse>} - The response body structure with success flag and payload.
   * @returns None
   */
  ctx.status = 200;
  ctx.body = <ApiResponse>{
    success: true,
    payload: _.isUndefined(moduleID)
      ? ecoModule.getModule()
      : ecoModule.getModule(moduleID),
  };
};

export default fetchModule;
