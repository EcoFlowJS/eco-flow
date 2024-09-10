import { Context } from "koa";
import { Upload } from "@ecoflow/utils/upload";
import path from "path";
import processImport from "../../../helpers/processImport.js";

const uploadImportFile = async (ctx: Context) => {
  const { _, config, server } = ecoFlow;

  try {
    if (_.isUndefined(ctx.request.files)) throw "Import file not defined.";
    const { importFile } = ctx.request.files;
    if (_.isArray(importFile)) throw "Select a single file to import from.";
    const file = path.join(
      Upload.getUploadDirectory,
      (await new Upload(importFile).filterZips().upload())[0]
    );

    if (await processImport(file)) {
      setTimeout(() => server.restartServer(), 5 * 1000);
      ctx.body = {
        success: true,
        payload: {
          msg: "File successfully imported.Restarting server in 5seconds...",
          restart: true,
        },
      };
    }
  } catch (error) {
    ctx.body = {
      error: true,
      payload: _.isString(error) ? error : JSON.stringify(error),
    };
  }
};

export default uploadImportFile;
