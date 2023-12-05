import stringToFunction from "../helpers/stringToFunction.helper";
import functionToString from "../helpers/functionToString.helper";
import installPackageHelper from "../helpers/installPackage.helper";
import { keys } from "ts-transformer-keys";

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
}
