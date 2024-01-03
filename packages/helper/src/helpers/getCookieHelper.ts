import { Context } from "koa";
import { Crypto } from "@eco-flow/utils";
import { Helper } from "../libs";

export default async (
  ctx: Context,
  name: string
): Promise<string | undefined> => {
  const crypto = new Crypto();
  for (const cookie of Helper.listAllCookies(ctx.headers.cookie)) {
    for (const [key, value] of Object.entries(cookie)) {
      if (await crypto.compareHash(name, key)) {
        return <string | undefined>value;
      }
    }
  }
  return undefined;
};
