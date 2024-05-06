import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

/**
 * Checks if the server is online and sets the response status and body accordingly.
 * @param {Context} ctx - The context object containing information about the request and response.
 * @returns None
 */
const isServerOnline = (ctx: Context) => {
  const { server } = ecoFlow;

  /**
   * Sets the status of the response to 200 and constructs a response body with ApiResponse structure.
   * @param {number} 200 - The HTTP status code for success.
   * @param {<ApiResponse>} - The structure of the response body containing success status and payload.
   * @returns None
   */
  ctx.status = 200;
  ctx.body = <ApiResponse>{
    success: true,
    payload: { isServerOnline: server.serverState === "Online" },
  };
};

export default isServerOnline;
