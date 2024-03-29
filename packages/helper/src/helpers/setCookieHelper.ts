import { SetOption } from "@ecoflow/types";
import { Context } from "koa";
import { Helper } from "../libs";

export default async (
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
