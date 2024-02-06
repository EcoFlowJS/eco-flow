import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const isServerOnline = (ctx: Context) => {
  const { server } = ecoFlow;

  ctx.status = 200;
  ctx.body = <ApiResponse>{
    success: true,
    payload: { isServerOnline: server.serverState === "Online" },
  };
};

const serverCloseRestart = (ctx: Context) => {
  const { Mode } = <any>ctx.request.body;
  const { server } = ecoFlow;

  ctx.status = 200;

  switch (Mode) {
    case "restart":
      setTimeout(() => server.restartServer(), 30 * 1000);
      ctx.body = <ApiResponse>{
        success: true,
        payload: "Server will be restart in 30 seconds",
      };
      break;
    case "stop":
      setTimeout(() => server.closeServer(true), 30 * 1000);
      ctx.body = <ApiResponse>{
        success: true,
        payload: "Server will be stopped in 30 seconds",
      };
      break;
    case "status":
      ctx.body = <ApiResponse>{
        success: true,
        payload: { isServerOnline: server.serverState === "Online" },
      };
      break;
  }
};

export { isServerOnline, serverCloseRestart };
