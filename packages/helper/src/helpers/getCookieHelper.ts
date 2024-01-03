import { Context } from "koa";
import { Helper } from "../libs";

export default async (
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
