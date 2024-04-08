import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const getNodes = async (ctx: Context) => {
  const { ecoModule } = ecoFlow;
  const { nodeId } = ctx.params;
  try {
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
