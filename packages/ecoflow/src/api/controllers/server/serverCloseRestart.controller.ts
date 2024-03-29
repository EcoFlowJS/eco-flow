import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const serverCloseRestart = async (ctx: Context) => {
  const { Mode } = <any>ctx.request.body;
  const { server, service } = ecoFlow;

  ctx.status = 200;

  switch (Mode) {
    case "restart":
      setTimeout(async () => {
        await service.AuditLogsService.addLog({
          message: `Server is restarted`,
          type: "Info",
          userID: ctx.user,
        });
        server.restartServer();
      }, 30 * 1000);
      ctx.body = <ApiResponse>{
        success: true,
        payload: "Server will be restart in 30 seconds",
      };
      await service.AuditLogsService.addLog({
        message: `Server is restart process started`,
        type: "Info",
        userID: ctx.user,
      });
      break;
    case "stop":
      setTimeout(async () => {
        await service.AuditLogsService.addLog({
          message: `Server is stopped`,
          type: "Info",
          userID: ctx.user,
        });
        server.closeServer(true);
      }, 30 * 1000);
      ctx.body = <ApiResponse>{
        success: true,
        payload: "Server will be stopped in 30 seconds",
      };
      await service.AuditLogsService.addLog({
        message: `Server is stop process started`,
        type: "Info",
        userID: ctx.user,
      });
      break;
    case "status":
      ctx.body = <ApiResponse>{
        success: true,
        payload: { isServerOnline: server.serverState === "Online" },
      };
      break;
  }
};

export default serverCloseRestart;
