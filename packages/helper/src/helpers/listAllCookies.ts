import { Context } from "koa";

export default (cookie: Context["headers"]["cookie"]) => {
  if (typeof cookie === "undefined") return [];
  const cookieList = cookie!.split("; ");
  return cookieList.map((val) => {
    const tmp = val.split("=");
    const cookieToObject = Object.create({});
    cookieToObject[tmp[0]] = tmp[1];
    return cookieToObject;
  });
};
