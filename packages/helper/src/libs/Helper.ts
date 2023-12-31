import stringToFunction from "../helpers/stringToFunction.helper";
import functionToString from "../helpers/functionToString.helper";
import installPackageHelper from "../helpers/installPackage.helper";
import removePackageHelper from "../helpers/removePackage.helper";
import fetchFromEnv from "../helpers/fetchFromEnv";
import getRandomInt from "../helpers/getRandomInt";

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
}
