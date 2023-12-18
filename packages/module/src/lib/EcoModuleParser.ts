import { EcoModuleParser as IEcoModuleParser } from "@eco-flow/types";
import fse from "fs-extra";
import _ from "lodash";

export class EcoModuleParser implements IEcoModuleParser {
  constructor() {}

  /**
   * Extract the controller function from the template file and return the controller function.
   * @param controllerPath Location of the controller file that contains the working sinippets of the controller.
   * @returns {Function} Controller function that can be used in the middleware.
   */
  static processControllers(controllerPath: string): Function {
    let controller: Function = (ctx: any) => ctx;
    if (!fse.existsSync(controllerPath)) return controller;
    try {
      const tempController = require(controllerPath);
      if (!_.isFunction(tempController)) return controller;
      return tempController;
    } catch {
      return controller;
    }
  }
}
