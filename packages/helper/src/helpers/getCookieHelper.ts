import { Context } from "koa";
import { Helper } from "../libs";

/**
 * Asynchronously retrieves a cookie value from the context object based on the cookie name.
 * @param {Context} ctx - The context object containing the cookies.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns A Promise that resolves to the value of the cookie, or undefined if not found.
 */
const getCookieHelper = async (
  ctx: Context,
  name: string
): Promise<string | undefined> => {
  for (const cookie of Helper.listAllCookies(ctx.headers.cookie)) {
    for (const [key, value] of Object.entries(cookie)) {
      if (await Helper.compareHash(name, key)) {
        return <string | undefined>value;
      }
    }
  }
  return undefined;
};

export default getCookieHelper;
