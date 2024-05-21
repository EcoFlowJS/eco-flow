import { list } from "drivelist";
import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";
import fse from "fs-extra";
import folderHasReadPermission from "../../../helper/folderHasReadPermission.helper";

const directoryFetcher = async (ctx: Context) => {
  const { _ } = ecoFlow;
  const { path } = ctx.request.body;
  let { type } = ctx.request.body;

  if (_.isUndefined(path)) {
    ctx.body = <ApiResponse>{
      success: true,
      payload: (await list())
        .map((drive) => drive.mountpoints)
        .map((drive) =>
          drive.reduce(
            (acc, drive) => (acc ? acc + "," + drive.path : drive.path),
            ""
          )
        )
        .reduce((acc, drive) => (acc ? acc + "," + drive : drive), "")
        .replace(/\\/g, "/")
        .split(",")
        .sort(),
    };
    return;
  }

  if (_.isUndefined(type)) type = "File";

  ctx.body = <ApiResponse>{
    success: true,
    payload: (await fse.readdir(path, { withFileTypes: true }))
      .filter((dirent) =>
        type === "Directory"
          ? dirent.isDirectory()
          : (dirent.isDirectory() && folderHasReadPermission(dirent)) ||
            dirent.isFile()
      )
      .sort()
      .sort((a, b) => {
        if (a.isDirectory()) {
          if (b.isDirectory()) return 1;
          if (b.isFile()) return -1;
        } else {
          if (b.isDirectory()) return 1;
          if (b.isFile()) return 0;
        }
        return 0;
      })
      .map((dirent) => ({
        name: dirent.name,
        type: dirent.isDirectory() ? "Directory" : "File",
      })),
  };
};

export default directoryFetcher;
