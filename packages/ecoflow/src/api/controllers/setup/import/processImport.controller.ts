import { Context } from "koa";
import path from "path";
import fse from "fs-extra";
import StreamZip from "node-stream-zip";

const processImportSteps = async (fileName: string) => {
  const { config, server } = ecoFlow;
  const { userDir } = config._config;
  const { socket } = server;
  const uploadDir = path.join(userDir!, "uploads");
  const file = path.join(uploadDir, fileName);

  if (!(await fse.exists(file))) {
    setTimeout(
      () =>
        socket.emit("importFileSetup", {
          error: true,
          payload: "Import File does not exist or get corrupted.",
        }),
      500
    );
    return;
  }

  const zip = new StreamZip.async({ file: file });
  const entries = Object.keys(await zip.entries());
  if (
    !entries.includes("database.json") ||
    !entries.includes("flow.json") ||
    !entries.includes("packages.json") ||
    !entries.includes("server.json")
  ) {
    setTimeout(
      () =>
        socket.emit("importFileSetup", {
          error: true,
          payload:
            "Import File does not exist all requied files or get corrupted.",
        }),
      500
    );
    return;
  }

  //TODO: Complete the import file setup process.

  setTimeout(() => {
    socket.emit("importFileSetup", {
      success: true,
      payload: {
        msg: "Import File Process Success. Restarting in 5sec for deplying the import.",
        restart: true,
      },
    });
    setTimeout(() => server.restartServer(), 5000);
  }, 500);
};

const processImport = async (ctx: Context) => {
  const { _ } = ecoFlow;
  const { newFileName } = ctx.request.body;

  if (_.isEmpty(newFileName)) {
    ctx.body = {
      error: true,
      payload: "Error while Processing Import.",
    };
    return;
  }

  processImportSteps(newFileName);
  ctx.body = {
    success: true,
    payload: "Import File started processing...",
  };
};

export default processImport;
