import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";
import fetchBackupFiles from "../../helpers/fetchBackupFiles.js";

const backedFilesFetch = async (ctx: Context) => {
  try {
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

export default backedFilesFetch;
