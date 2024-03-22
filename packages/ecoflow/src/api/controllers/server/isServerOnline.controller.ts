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

export default isServerOnline;
