import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const deployFlowConfiguration = async (ctx: Context) => {
  const { _, flowEditor } = ecoFlow;
  try {
    const { flowconfigurations } = ctx.request.body;
    if (_.isUndefined(flowconfigurations) || _.isEmpty(flowconfigurations))
      throw "No flow configurations provided";
    if (!(await flowEditor.deploy(flowconfigurations)))
      throw "Error deploying flow configuration";
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
