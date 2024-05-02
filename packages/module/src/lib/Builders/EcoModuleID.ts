import { EcoModuleID as IEcoModuleID } from "@ecoflow/types";
import md5 from "md5";

export class EcoModuleID implements IEcoModuleID {
  _id: string;

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
