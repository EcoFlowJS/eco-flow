import Helper from "@eco-flow/helper";
import { Context, Next } from "koa";
import _ from "lodash";

export default async (ctx: Context, next: Next) => {
  const options = ecoFlow.server.isSecure
    ? {
        secure: true,
        httpOnly: true,
        maxAge: 7 * 1000 * 60 * 60 * 24,
      }
    : {
        secure: false,
        httpOnly: true,
        maxAge: 7 * 1000 * 60 * 60 * 24,
      };
  //   await Helper.setCookie(
  //     ctx,
  //     "RefreshToken",
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbiIsImlhdCI6MTcwNDI3NTQ3NSwiZXhwIjoxNzA0MzExNDc1fQ.h55w3HtgC2uLX0qvmMCWaF8R-syupFybbcccOl25RYU",
  //     options
  //   );

  const token = await Helper.getCookie(ctx, "RefreshToken");
  if (_.isUndefined(token)) {
    ctx.status = 403;
    ctx.body = {
      error: true,
      payload: "Not authorized User.",
    };
    return;
  }
  const user = Helper.verifyJwtToken(token);
  if (user === null) {
    ctx.status = 403;
    ctx.body = {
      error: true,
      payload: "Invalid Refresh Token.",
    };
    return;
  }

  const { _id } = <{ _id: string }>user;

  console.log(await ecoFlow.service.TokenServices.checkToken("", _id));

  ctx.body = _id;
};
