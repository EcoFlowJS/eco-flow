import stringToFunction from "../helpers/stringToFunction.helper";
import functionToString from "../helpers/functionToString.helper";
import installPackageHelper, {
  IinstallPackageHelper,
} from "../helpers/installPackage.helper";
import {
  SpawnOptions,
  SpawnOptionsWithStdioTuple,
  SpawnOptionsWithoutStdio,
  StdioNull,
  StdioPipe,
} from "child_process";

export class Helper {
  static stringToFunction(value: string): unknown {
    return stringToFunction(value);
  }

  static functionToString(value: Function): string | unknown {
    return functionToString(value);
  }

  static installPackageHelper(
    installDir: string,
    command: string,
    args: string[],
    options:
      | SpawnOptionsWithoutStdio
      | SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>
      | SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>
      | SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>
      | SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>
      | SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>
      | SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>
      | SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>
      | SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>
      | SpawnOptions = {}
  ): IinstallPackageHelper {
    return installPackageHelper(command, args, options);
  }
}
