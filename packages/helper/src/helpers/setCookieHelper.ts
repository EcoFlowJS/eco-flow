import { SetOption } from "@ecoflow/types";
import { Context } from "koa";
import { Helper } from "../libs/index.js";

/**
 * Sets a cookie in the context with the given name, value, and options.
 * If a cookie with the same name already exists, it updates the value of that cookie.
 * @param {Context} ctx - The context object containing the request and response objects.
 * @param {string} name - The name of the cookie to set.
 * @param {any} val - The value to set for the cookie.
 * @param {SetOption} [options] - The options for setting the cookie (e.g., maxAge, path, etc.).
 * @returns {Promise<void>} A promise that resolves once the cookie is set.
 */
const setCookieHelper = async (
  ctx: Context,
  name: string,
  val: any,
  options?: SetOption
): Promise<void> => {
  let exitsKey: string | null = null;
  for (const cookie of Helper.listAllCookies(ctx.headers.cookie)) {
    for (const [key, value] of Object.entries(cookie)) {
      if (await Helper.compareHash(name, key)) {
        exitsKey = key;
        break;
      }
    }
    if (exitsKey !== null) break;
  }

  if (exitsKey !== null) {
    name = exitsKey;
  } else {
    name = await Helper.createHash(name);
  }
  ctx.cookies.set(name, val, options);
};

export default setCookieHelper;
