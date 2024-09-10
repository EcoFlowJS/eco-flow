import { ApiResponse, configOptions } from "@ecoflow/types";
import { Context } from "koa";
import systemDatabaseConfigurations from "../../../helpers/systemDatabaseConfigurations.js";

/**
 * Validates the database configuration based on the context provided.
 * @param {Context} ctx - The context object containing the request body.
 * @returns None
 */
const databaseValidatorBlank = async (ctx: Context) => {
  const { _ } = ecoFlow;
  const { useDefault } = ctx.request.body;
  ctx.status = 200;

  /**
   * Checks if the useDefault flag is false, then retrieves the system database configurations
   * based on the request body and validates the database configuration. If the database
   * configuration is invalid, it returns an error response. Otherwise, it returns a success response.
   * @param {boolean} useDefault - Flag to determine whether to use default configurations.
   * @returns None
   */
  if (!useDefault) {
    const config: configOptions = {
      ...(await systemDatabaseConfigurations(ctx.request.body)),
    };

    if (_.isUndefined(config.database)) {
      ctx.body = <ApiResponse>{
        error: true,
        payload: "Invalid Database configuration.",
      };
      return;
    }
    ctx.body = <ApiResponse>{
      success: true,
      payload: "Database configuration Validation Success.",
    };
  }
};

export default databaseValidatorBlank;
