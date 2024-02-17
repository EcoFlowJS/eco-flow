import Helper from "@eco-flow/helper";
import { ApiResponse } from "@eco-flow/types";
import { Context } from "koa";

const logoutController = async (ctx: Context) => {
  const token = await Helper.getCookie(ctx, "RefreshToken");
  const { _id } = ctx.token;
  const { TokenServices } = ecoFlow.service;
  ctx.status = 200;
  try {
    await TokenServices.removeToken(token!, _id);
    ctx.body = <ApiResponse>{
      success: true,
      payload: "Login successful",
    };
  } catch (err) {
    ctx.body = <ApiResponse>{ error: true, payload: err };
  }
};

export default logoutController;
