import { EcoModuleID as IEcoModuleID } from "@ecoflow/types";
import md5 from "md5";

/**
 * Represents an EcoModuleID that implements the IEcoModuleID interface.
 * @class
 */
export class EcoModuleID implements IEcoModuleID {
  /**
   * A string representing an ID.
   */
  _id: string;

  /**
   * Constructs a new instance of a module with the given module name and optional node name.
   * @param {string} moduleName - The name of the module.
   * @param {string} [nodeName] - The name of the node within the module (optional).
   * @returns None
   */
  constructor(moduleName: string, nodeName?: string) {
    const { _ } = ecoFlow;

    this._id =
      _.isUndefined(nodeName) || _.isEmpty(nodeName)
        ? /[a-fA-F0-9]{32}/.test(moduleName)
          ? moduleName
          : md5(moduleName)
        : md5(`${moduleName}.${nodeName}`);
  }
}
