import { SetOption } from "@eco-flow/types";
import { Crypto } from "@eco-flow/utils";
import { Context } from "koa";
import { Helper } from "../libs";

export default async (
  ctx: Context,
  name: string,
  val: any,
  options?: SetOption
): Promise<void> => {
  const crypto = new Crypto();
  let exitsKey: string | null = null;
  for (const cookie of Helper.listAllCookies(ctx.headers.cookie)) {
    for (const [key, value] of Object.entries(cookie)) {
      if (await crypto.compareHash(name, key)) {
        exitsKey = key;
        break;
      }
    }
    if (exitsKey !== null) break;
  }

  if (exitsKey !== null) {
    name = exitsKey;
  } else {
    name = await crypto.createHash(name);
  }
  ctx.cookies.set(name, val, options);
};
