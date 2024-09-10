import { ApiResponse } from "@ecoflow/types";
import AdmZip from "adm-zip";
import { Context } from "koa";
import path from "path";
import restoreBackupHelper from "../../helpers/restoreBackupHelper.js";
import { remove } from "fs-extra";

const restoreBackup = async (ctx: Context) => {
  const { _, server, config } = ecoFlow;
  const { file } = ctx.request.body;
  try {
    if (_.isUndefined(ctx.request.files) && _.isUndefined(file))
      throw "File not found.";

    const response: ApiResponse = {
      error: true,
      payload: "Invalid restore method",
    };

    if (ctx.request.files) {
      const { restoreFile } = ctx.request.files;

      if (_.isArray(restoreFile)) throw "Please provide a single restore file.";

      await restoreBackupHelper(new AdmZip(restoreFile.filepath));
      await remove(restoreFile.filepath);

      response.error = false;
      response.success = true;
      response.payload =
        "Backup Restore successfully saved. Server will be restarted after 10 seconds.";
    }

    if (file) {
      const filepath: string = path.join(
        config.get("userDir"),
        "backups",
        file + ".zip"
      );
      await await restoreBackupHelper(new AdmZip(filepath));
      response.error = false;
      response.success = true;
      response.payload =
        "Backup Restore successfully saved. Server will be restarted after 10 seconds.";
    }
    if (!response.error) setTimeout(() => server.restartServer(), 10 * 1000);
    ctx.body = response;
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default restoreBackup;
