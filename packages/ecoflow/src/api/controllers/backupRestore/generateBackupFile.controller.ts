import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";
import generateBackupZip from "../../helpers/generateBackupZip.js";
import { Readable } from "stream";

const generateBackupFile = async (ctx: Context) => {
  const { _ } = ecoFlow;
  let { backup } = ctx.request.body;

  try {
    if (_.isUndefined(backup) || _.isEmpty(backup))
      throw "Backup Selections is required.";

    backup = backup.map((val: string) => val.split("."));

    const subConfigs = backup.filter((val: string[]) => val.length > 1);
    backup = backup
      .filter((val: string[]) => val.length === 1)
      .map((val: string[]) => val.reduce((acc, val) => acc + val, ""));

    const databaseConfigs: string[] | boolean = backup.includes(
      "databaseConfigs"
    )
      ? true
      : subConfigs.filter((val: string[]) => val[0] === "databaseConfigs")
          .length > 0
      ? subConfigs
          .filter((val: string[]) => val[0] === "databaseConfigs")
          .map((val: string[]) => val[1])
      : false;
    const environmentConfigs: boolean = backup.includes("environmentConfigs")
      ? true
      : false;
    const flowConfigs: boolean = backup.includes("flowConfigs") ? true : false;
    const installedPackages: string[] | boolean = backup.includes(
      "installedPackages"
    )
      ? true
      : subConfigs.filter((val: string[]) => val[0] === "installedPackages")
          .length > 0
      ? subConfigs
          .filter((val: string[]) => val[0] === "installedPackages")
          .map((val: string[]) => val[1])
      : false;
    const serverConfigs: boolean = backup.includes("serverConfigs")
      ? true
      : false;

    const zip = await generateBackupZip(
      databaseConfigs,
      environmentConfigs,
      flowConfigs,
      installedPackages,
      serverConfigs
    );

    ctx.body = Readable.from(zip);
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default generateBackupFile;
