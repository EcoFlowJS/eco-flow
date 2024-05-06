import { Context } from "koa";

/**
 * Extracts and returns a list of cookies from the provided cookie header.
 * @param {Context["headers"]["cookie"]} cookie - The cookie header from which to extract cookies.
 * @returns {Object[]} An array of objects representing the cookies extracted from the cookie header.
 */
const listAllCookies = (cookie: Context["headers"]["cookie"]) => {
  if (typeof cookie === "undefined") return [];
  const cookieList = cookie!.split("; ");
  return cookieList.map((val) => {
    const tmp = val.split("=");
    const cookieToObject = Object.create({});
    cookieToObject[tmp[0]] = tmp[1];
    return cookieToObject;
  });
};

export default listAllCookies;
