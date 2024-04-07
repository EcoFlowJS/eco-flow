import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const getFlows = async (ctx: Context) => {
  const { flowName } = ctx.params;
  const { flowEditor } = ecoFlow;

  try {
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
