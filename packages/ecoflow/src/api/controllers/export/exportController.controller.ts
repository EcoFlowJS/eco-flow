import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";
import exportTemplate from "../../helpers/exportTemplate";
import { Readable } from "stream";
import exportProject from "../../helpers/exportProject";

const exportController = async (ctx: Context) => {
  const { _ } = ecoFlow;
  const { exportType } = ctx.request.body;

  try {
    if (_.isUndefined(exportType) || _.isEmpty(exportType))
      throw "Export type not defined.";

    switch (exportType) {
      case "export":
        const project = await exportProject();
        ctx.body = Readable.from(project);
        break;
      case "template":
        const template = await exportTemplate();
        ctx.body = Readable.from(template);
        break;
      default:
        throw "Invalid export type.";
    }
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default exportController;
