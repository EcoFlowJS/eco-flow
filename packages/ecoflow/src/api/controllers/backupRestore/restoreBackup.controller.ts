import { ApiResponse } from "@ecoflow/types";
import AdmZip from "adm-zip";
import { Context } from "koa";
import restoreBackupHelper from "../../helpers/restoreBackupHelper";

const restoreBackup = async (ctx: Context) => {
  const { _, server } = ecoFlow;
  try {
    if (_.isUndefined(ctx.request.files)) throw "File not found.";

    const { restoreFile } = ctx.request.files;

    if (_.isArray(restoreFile)) throw "Please provide a single restore file.";

    await restoreBackupHelper(new AdmZip(restoreFile.filepath));

    setTimeout(() => server.restartServer(), 10 * 1000);
    ctx.body = <ApiResponse>{
      success: true,
      payload:
        "Backup Restore successfully saved. Server will be restarted after 10 seconds.",
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default restoreBackup;
