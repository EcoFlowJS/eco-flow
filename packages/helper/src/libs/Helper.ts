import stringToFunction from "../helpers/stringToFunction.helper";
import functionToString from "../helpers/functionToString.helper";
import installPackageHelper from "../helpers/installPackage.helper";
import removePackageHelper from "../helpers/removePackage.helper";
import fetchFromEnv from "../helpers/fetchFromEnv";
import getRandomInt from "../helpers/getRandomInt";
import generateJwtToken from "../helpers/generateJwtToken";
import { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import verifyJwtToken from "../helpers/verifyJwtToken";
import type { Context } from "koa";
import setCookieHelper from "../helpers/setCookieHelper";
import { SetOption } from "@eco-flow/types";
import listAllCookies from "../helpers/listAllCookies";

export class Helper {
  static stringToFunction(value: string): unknown {
    return stringToFunction(value);
  }

  static functionToString(value: Function): string | unknown {
    return functionToString(value);
  }

  static async installPackageHelper(
    installDir: string,
    packageNames: string | string[]
  ): Promise<void> {
    await installPackageHelper(installDir, packageNames);
  }

  static async removePackageHelper(
    installDir: string,
    packageNames: string | string[]
  ): Promise<void> {
    await removePackageHelper(installDir, packageNames);
  }

  static fetchFromEnv(env: string): string | undefined {
    return fetchFromEnv(env);
  }

  static getRandomInt(min: number, max: number): number {
    return getRandomInt(min, max);
  }

  static generateJwtToken(
    value: string | object | Buffer,
    options?: SignOptions
  ): string {
    return generateJwtToken(value, options);
  }

  static verifyJwtToken(
    token: string,
    options?: VerifyOptions
  ): JwtPayload | string | null {
    return verifyJwtToken(token, options);
  }

  static listAllCookies(cookie: Context["headers"]["cookie"]): Array<any> {
    return listAllCookies(cookie);
  }

  static async setCookie(
    ctx: Context,
    name: string,
    value: string,
    options?: SetOption
  ): Promise<void> {
    await setCookieHelper(ctx, name, value, options);
  }
}
