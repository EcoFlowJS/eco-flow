import stringToFunction from "../helpers/stringToFunction";
import functionToString from "../helpers/functionToString";
import installPackageHelper from "../helpers/installPackage";
import removePackageHelper from "../helpers/removePackage";
import fetchFromEnv from "../helpers/fetchFromEnv";
import getRandomInt from "../helpers/getRandomInt";
import generateJwtToken from "../helpers/generateJwtToken";
import { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import verifyJwtToken from "../helpers/verifyJwtToken";
import type { Context } from "koa";
import setCookieHelper from "../helpers/setCookieHelper";
import { SetOption } from "@ecoflow/types";
import listAllCookies from "../helpers/listAllCookies";
import getCookieHelper from "../helpers/getCookieHelper";
import compareHashHelper from "../helpers/compareHashHelper";
import createHashHelper from "../helpers/createHashHelper";
import xssFilterHelper from "../helpers/xssFilterHelper";
import validatePasswordRegex from "../helpers/validatePasswordRegex";
import requireUncached from "../helpers/requireUncached";

/**
 * Helper class with static methods for various utility functions.
 */
export class Helper {
  /**
   * Converts a string representation of a function to an actual function.
   * @param {string} value - The string representation of the function.
   * @returns The function represented by the input string.
   */
  static stringToFunction(value: string): unknown {
    return stringToFunction(value);
  }

  /**
   * Filters out potential cross-site scripting (XSS) attacks from the given string value.
   * @param {string} value - The string value to filter for XSS attacks.
   * @returns {string} - The filtered string value without XSS vulnerabilities.
   */
  static xssFilterHelper(value: string): string {
    return xssFilterHelper(value);
  }

  /**
   * Converts a function to a string representation.
   * @param {Function} value - The function to convert to a string.
   * @returns {string | unknown} A string representation of the function.
   */
  static functionToString(value: Function): string | unknown {
    return functionToString(value);
  }

  /**
   * Asynchronously installs the specified package or packages into the given directory.
   * @param {string} installDir - The directory where the packages will be installed.
   * @param {string | string[]} packageNames - The name or names of the packages to install.
   * @returns A promise that resolves when the packages are successfully installed.
   */
  static async installPackageHelper(
    installDir: string,
    packageNames: string | string[]
  ): Promise<void> {
    await installPackageHelper(installDir, packageNames);
  }

  /**
   * Asynchronously removes the specified package or packages from the given installation directory.
   * @param {string} installDir - The directory where the packages are installed.
   * @param {string | string[]} packageNames - The name or names of the packages to be removed.
   * @returns {Promise<void>} A promise that resolves once the packages have been removed.
   */
  static async removePackageHelper(
    installDir: string,
    packageNames: string | string[]
  ): Promise<void> {
    await removePackageHelper(installDir, packageNames);
  }

  /**
   * Fetches a value from the environment variables based on the specified environment and type.
   * @param {string} env - The name of the environment variable to fetch.
   * @param {"user" | "system"} [type="user"] - The type of environment variable to fetch from (user or system).
   * @returns The value of the environment variable if found, otherwise undefined.
   */
  static fetchFromEnv(
    env: string,
    type: "user" | "system" = "user"
  ): string | undefined {
    return fetchFromEnv(env, type);
  }

  /**
   * Generate a random integer between the specified minimum and maximum values.
   * @param {number} min - The minimum value for the random integer (inclusive).
   * @param {number} max - The maximum value for the random integer (inclusive).
   * @returns A random integer between the min and max values.
   */
  static getRandomInt(min: number, max: number): number {
    return getRandomInt(min, max);
  }

  /**
   * Generates a JWT token based on the provided value and options.
   * @param {string | object | Buffer} value - The value to be encoded in the token.
   * @param {SignOptions} [options] - The options for signing the token.
   * @returns {string} The generated JWT token.
   */
  static generateJwtToken(
    value: string | object | Buffer,
    options?: SignOptions
  ): string {
    return generateJwtToken(value, options);
  }

  /**
   * Verifies the JWT token using the provided options.
   * @param {string} token - The JWT token to verify.
   * @param {VerifyOptions} [options] - The options to use for verification.
   * @returns {JwtPayload | string | null} The payload of the JWT token if verified successfully,
   * a string if the token is invalid, or null if verification fails.
   */
  static verifyJwtToken(
    token: string,
    options?: VerifyOptions
  ): JwtPayload | string | null {
    return verifyJwtToken(token, options);
  }

  /**
   * Asynchronously creates a hash value for the given input using the createHashHelper function.
   * @param {any} val - The value to be hashed.
   * @returns {Promise<string>} A promise that resolves to the hash value of the input.
   */
  static async createHash(val: any): Promise<string> {
    return await createHashHelper(val);
  }

  /**
   * Compares a value to a hash using a helper function.
   * @param {string} val - The value to compare.
   * @param {string} hash - The hash to compare against.
   * @returns {Promise<boolean>} A promise that resolves to true if the value matches the hash, false otherwise.
   */
  static async compareHash(val: string, hash: string): Promise<boolean> {
    return await compareHashHelper(val, hash);
  }

  /**
   * Returns a list of all cookies from the provided cookie header.
   * @param {Context["headers"]["cookie"]} cookie - The cookie header containing the cookies.
   * @returns {Array<any>} - An array containing all the cookies.
   */
  static listAllCookies(cookie: Context["headers"]["cookie"]): Array<any> {
    return listAllCookies(cookie);
  }

  /**
   * Asynchronously sets a cookie with the given name, value, and options in the provided context.
   * @param {Context} ctx - The context in which to set the cookie.
   * @param {string} name - The name of the cookie to set.
   * @param {string} value - The value to assign to the cookie.
   * @param {SetOption} [options] - The options to apply when setting the cookie.
   * @returns A Promise that resolves when the cookie is successfully set.
   */
  static async setCookie(
    ctx: Context,
    name: string,
    value: string,
    options?: SetOption
  ): Promise<void> {
    return await setCookieHelper(ctx, name, value, options);
  }

  /**
   * Retrieves a cookie value from the provided context using the given cookie name.
   * @param {Context} ctx - The context object containing the cookies.
   * @param {string} name - The name of the cookie to retrieve.
   * @returns A Promise that resolves to the value of the cookie, or undefined if the cookie is not found.
   */
  static async getCookie(
    ctx: Context,
    name: string
  ): Promise<string | undefined> {
    return await getCookieHelper(ctx, name);
  }

  /**
   * Validates a password using a regular expression pattern.
   * @param {string} value - The password to validate.
   * @returns {boolean} - True if the password matches the regular expression pattern, false otherwise.
   */
  static validatePasswordRegex(value: string): boolean {
    return validatePasswordRegex(value);
  }

  /**
   * Requires a module in Node.js without caching the result, allowing for dynamic reloading.
   * @param {string} id - The module identifier to require
   * @returns The result of requiring the module
   */
  static requireUncached(id: string): any {
    return requireUncached(id);
  }
}
