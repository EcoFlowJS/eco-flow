import Helper from "@eco-flow/helper";
import { Context, Next } from "koa";

const refreshToken = async (ctx: Context, next: Next) => {
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
  await Helper.setCookie(
    ctx,
    "RefreshToken",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbiIsImlhdCI6MTcwNDI3NTQ3NSwiZXhwIjoxNzA0MzExNDc1fQ.h55w3HtgC2uLX0qvmMCWaF8R-syupFybbcccOl25RYU",
    options
  );
  ctx.body = "";
};

export default {
  refreshToken: refreshToken,
};
