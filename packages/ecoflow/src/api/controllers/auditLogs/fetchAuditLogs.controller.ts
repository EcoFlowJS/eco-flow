import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const fetchAuditLogs = async (ctx: Context) => {
  try {
    const { AuditLogsService } = ecoFlow.service;
    const { page } = ctx.params;
    ctx.body = <ApiResponse>{
      success: true,
      payload: await AuditLogsService.fetchAuditLogs(page),
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default fetchAuditLogs;
