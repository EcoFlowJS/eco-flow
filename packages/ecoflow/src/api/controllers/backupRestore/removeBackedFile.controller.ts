import path from "path";
import fse from "fs-extra";
import { Context } from "koa";
import { ApiResponse } from "@ecoflow/types";
import fetchBackupFiles from "../../helpers/fetchBackupFiles.js";

const removeBackedFile = async (ctx: Context) => {
  const { fileName } = ctx.params;
  const { _, config } = ecoFlow;

  try {
    if (_.isUndefined(fileName) || _.isEmpty(fileName))
      throw "Missing Backed File Name.";

    if (
      !(await fse.exists(
        path.join(config.get("userDir"), "backups", `${fileName}.zip`)
      ))
    )
      throw "File does not exist.";

    await fse.remove(
      path.join(config.get("userDir"), "backups", `${fileName}.zip`)
    );

    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await fetchBackupFiles(),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default removeBackedFile;
