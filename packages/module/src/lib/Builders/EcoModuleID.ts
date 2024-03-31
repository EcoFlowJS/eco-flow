import { EcoModuleID as IEcoModuleID } from "@ecoflow/types";
import _ from "lodash";
import md5 from "md5";

export class EcoModuleID implements IEcoModuleID {
  _id: string;

  constructor(moduleName: string, nodeName?: string) {
    this._id =
      _.isUndefined(nodeName) || _.isEmpty(nodeName)
        ? md5(moduleName)
        : md5(`${moduleName}.${nodeName}`);
  }
}
