import { ApiResponse, configOptions } from "@eco-flow/types";
import { Context } from "koa";
import { systemDatabaseConfigutations } from "../../../helpers/parseServerConfigHelper";

const databaseValidatorBlank = async (ctx: Context) => {
  const { _ } = ecoFlow;
  const { useDefault } = ctx.request.body;
  ctx.status = 200;

  if (!useDefault) {
    const config: configOptions = {
      ...(await systemDatabaseConfigutations(ctx.request.body)),
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
